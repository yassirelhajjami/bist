const supabase   = require('../config/supabase')
const { mapRow }  = require('../utils/mapRow')
const { processImage } = require('../middleware/upload')
const fs   = require('fs')
const path = require('path')

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads'

exports.list = async (req, res) => {
  const { category } = req.query
  let query = supabase.from('gallery_images').select('*')
  if (category) query = query.eq('category', category)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, data: data.map(mapRow) })
}

exports.upload = async (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ success: false, message: 'No files uploaded' })

  const results = []
  for (const file of req.files) {
    const { filename, url, thumbnailUrl } = await processImage(file.buffer, file.originalname, 'images/gallery')
    const { data, error } = await supabase.from('gallery_images').insert({
      filename,
      original_name: file.originalname,
      url,
      thumbnail_url: thumbnailUrl,
      category:    req.body.category || 'Vie scolaire',
      caption:     req.body.caption  || '',
      size:        file.size,
      uploaded_by: req.user._id,
    }).select().single()
    if (!error && data) results.push(mapRow(data))
  }
  res.status(201).json({ success: true, data: results })
}

exports.update = async (req, res) => {
  const updates = { updated_at: new Date() }
  if (req.body.caption  !== undefined) updates.caption  = req.body.caption
  if (req.body.category !== undefined) updates.category = req.body.category

  const { data, error } = await supabase
    .from('gallery_images').update(updates).eq('id', req.params.id).select().single()
  if (error || !data) return res.status(404).json({ success: false, message: 'Image not found' })
  res.json({ success: true, data: mapRow(data) })
}

exports.remove = async (req, res) => {
  const { data: img, error } = await supabase
    .from('gallery_images').select('filename').eq('id', req.params.id).single()
  if (error || !img) return res.status(404).json({ success: false, message: 'Image not found' })

  await supabase.from('gallery_images').delete().eq('id', req.params.id)
  _deleteFiles(img.filename)
  res.json({ success: true, message: 'Image deleted' })
}

exports.bulkDelete = async (req, res) => {
  const { ids } = req.body
  const { data: imgs } = await supabase.from('gallery_images').select('filename').in('id', ids)
  await supabase.from('gallery_images').delete().in('id', ids)
  ;(imgs || []).forEach(img => _deleteFiles(img.filename))
  res.json({ success: true, message: `${ids.length} images deleted` })
}

function _deleteFiles(filename) {
  if (!filename) return
  try {
    const base  = path.join(UPLOAD_DIR, 'images', 'gallery', filename)
    const thumb = path.join(UPLOAD_DIR, 'images', 'gallery', 'thumbs', filename)
    if (fs.existsSync(base))  fs.unlinkSync(base)
    if (fs.existsSync(thumb)) fs.unlinkSync(thumb)
  } catch {}
}
