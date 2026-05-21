const router = require('express').Router()
const { protect } = require('../middleware/auth')
const { upload, processImage, saveDocument } = require('../middleware/upload')

const authMiddleware = process.env.NODE_ENV === 'production' ? [protect] : []

router.post('/image', ...authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })
    const ext = req.file.originalname.split('.').pop().toLowerCase()
    if (ext === 'pdf') {
      const result = await saveDocument(req.file.buffer, req.file.originalname)
      return res.json({ success: true, url: result.url, type: 'document' })
    }
    const subdir = req.query.subdir || 'images/general'
    const result = await processImage(req.file.buffer, req.file.originalname, subdir)
    res.json({ success: true, url: result.url, thumbnailUrl: result.thumbnailUrl, type: 'image' })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ success: false, message: err.message || 'Upload failed' })
  }
})

module.exports = router
