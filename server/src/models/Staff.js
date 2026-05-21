const mongoose = require('mongoose')

const staffSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  position:   { type: String, required: true, trim: true },
  department: { type: String, enum: ['Direction', 'Maternelle', 'Primaire', 'Collège', 'Lycée', 'Administration', 'Parascolaire'], default: 'Administration' },
  bio:        { type: String, default: '' },
  photo:      { type: String, default: null },
  email:      { type: String, default: '' },
  phone:      { type: String, default: '' },
  order:      { type: Number, default: 0 },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Staff', staffSchema)
