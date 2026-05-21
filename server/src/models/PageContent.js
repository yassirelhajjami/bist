const mongoose = require('mongoose')

const pageContentSchema = new mongoose.Schema({
  page:    { type: String, required: true, enum: ['homepage', 'admissions'] },
  key:     { type: String, required: true },
  value:   { type: mongoose.Schema.Types.Mixed, required: true },
  label:   { type: String },
  type:    { type: String, enum: ['text', 'richtext', 'url', 'image', 'array', 'object'], default: 'text' },
}, { timestamps: true })

pageContentSchema.index({ page: 1, key: 1 }, { unique: true })

module.exports = mongoose.model('PageContent', pageContentSchema)
