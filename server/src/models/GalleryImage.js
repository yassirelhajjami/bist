const mongoose = require('mongoose')

const galleryImageSchema = new mongoose.Schema({
  filename:     { type: String, required: true },
  originalName: { type: String },
  url:          { type: String, required: true },
  thumbnailUrl: { type: String },
  category:     { type: String, enum: ['Vie scolaire', 'Activités', 'Infrastructure', 'Événements', 'Autre'], default: 'Vie scolaire' },
  caption:      { type: String, default: '' },
  size:         { type: Number },
  uploadedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

module.exports = mongoose.model('GalleryImage', galleryImageSchema)
