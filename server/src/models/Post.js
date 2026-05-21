const mongoose = require('mongoose')
const slugify = require('slugify')

const postSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, unique: true },
  content:     { type: String, required: true },
  excerpt:     { type: String, maxlength: 300 },
  coverImage:  { type: String, default: null },
  category:    { type: String, enum: ['Actualité', 'Événement', 'Résultats', 'Annonce', 'Partenariat', 'Autre'], default: 'Actualité' },
  status:      { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishDate: { type: Date, default: null },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views:       { type: Number, default: 0 },
}, { timestamps: true })

postSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now()
  }
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/<[^>]+>/g, '').substring(0, 280)
  }
  next()
})

module.exports = mongoose.model('Post', postSchema)
