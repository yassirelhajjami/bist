const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  startDate:   { type: Date, required: true },
  endDate:     { type: Date, default: null },
  location:    { type: String, default: '' },
  bannerImage: { type: String, default: null },
  status:      { type: String, enum: ['upcoming', 'ongoing', 'past', 'cancelled'], default: 'upcoming' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

eventSchema.pre('save', function (next) {
  const now = new Date()
  if (this.endDate && this.endDate < now) this.status = 'past'
  else if (this.startDate <= now && (!this.endDate || this.endDate >= now)) this.status = 'ongoing'
  else this.status = 'upcoming'
  next()
})

module.exports = mongoose.model('Event', eventSchema)
