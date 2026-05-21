const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads'

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|pdf/
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '')
  if (allowed.test(ext)) cb(null, true)
  else cb(new Error('Only images (jpeg, jpg, png, gif, webp) and PDFs are allowed'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
})

async function processImage(buffer, filename, subdir = 'images') {
  const dir = path.join(UPLOAD_DIR, subdir)
  ensureDir(dir)

  const name = `${Date.now()}-${filename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')}`
  const webpName = name.replace(/\.[^.]+$/, '.webp')
  const fullPath = path.join(dir, webpName)

  await sharp(buffer)
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(fullPath)

  const thumbDir = path.join(dir, 'thumbs')
  ensureDir(thumbDir)
  const thumbPath = path.join(thumbDir, webpName)
  await sharp(buffer).resize(400, 300, { fit: 'cover' }).webp({ quality: 70 }).toFile(thumbPath)

  return {
    filename: webpName,
    url: `/${dir}/${webpName}`.replace(/\\/g, '/'),
    thumbnailUrl: `/${dir}/thumbs/${webpName}`.replace(/\\/g, '/'),
  }
}

async function saveDocument(buffer, originalname, subdir = 'documents') {
  const dir = path.join(UPLOAD_DIR, subdir)
  ensureDir(dir)
  const name = `${Date.now()}-${originalname.replace(/\s+/g, '-')}`
  const fullPath = path.join(dir, name)
  fs.writeFileSync(fullPath, buffer)
  return { filename: name, url: `/${dir}/${name}`.replace(/\\/g, '/') }
}

module.exports = { upload, processImage, saveDocument }
