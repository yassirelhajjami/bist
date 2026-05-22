const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const supabase = require('../config/supabase')

const BUCKET = 'media'

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '')
  if (/^(jpeg|jpg|png|gif|webp|pdf)$/.test(ext)) cb(null, true)
  else cb(new Error('Only images (jpeg, jpg, png, gif, webp) and PDFs are allowed'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
})

async function processImage(buffer, filename, subdir = 'images/general') {
  const base = `${Date.now()}-${filename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')}`
  const webpName = base.replace(/\.[^.]+$/, '.webp')

  const [webpBuf, thumbBuf] = await Promise.all([
    sharp(buffer).resize(1920, 1920, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer(),
    sharp(buffer).resize(400, 300, { fit: 'cover' }).webp({ quality: 70 }).toBuffer(),
  ])

  const mainPath = `${subdir}/${webpName}`
  const thumbPath = `${subdir}/thumbs/${webpName}`

  const [mainRes, thumbRes] = await Promise.all([
    supabase.storage.from(BUCKET).upload(mainPath, webpBuf, { contentType: 'image/webp', upsert: false }),
    supabase.storage.from(BUCKET).upload(thumbPath, thumbBuf, { contentType: 'image/webp', upsert: false }),
  ])

  if (mainRes.error) throw new Error(mainRes.error.message)
  if (thumbRes.error) throw new Error(thumbRes.error.message)

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(mainPath)
  const { data: { publicUrl: thumbUrl } } = supabase.storage.from(BUCKET).getPublicUrl(thumbPath)

  return { filename: webpName, url: publicUrl, thumbnailUrl: thumbUrl }
}

async function saveDocument(buffer, originalname) {
  const name = `${Date.now()}-${originalname.replace(/\s+/g, '-')}`
  const docPath = `documents/${name}`

  const { error } = await supabase.storage.from(BUCKET).upload(docPath, buffer, { upsert: false })
  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(docPath)
  return { filename: name, url: publicUrl }
}

module.exports = { upload, processImage, saveDocument }
