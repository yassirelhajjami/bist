const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
  schoolName:     { type: String, default: 'Badrane International School' },
  schoolNameFull: { type: String, default: 'Badrane International School Tanger' },
  logo:           { type: String, default: null },
  favicon:        { type: String, default: null },
  primaryColor:   { type: String, default: '#132d79' },
  secondaryColor: { type: String, default: '#C1273A' },
  contact: {
    phone:   { type: String, default: '' },
    email:   { type: String, default: '' },
    address: { type: String, default: 'Tanger, Maroc' },
    mapUrl:  { type: String, default: '' },
  },
  socialMedia: {
    facebook:  { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube:   { type: String, default: '' },
    twitter:   { type: String, default: '' },
  },
  seo: {
    title:       { type: String, default: 'Badrane International School – Tanger' },
    description: { type: String, default: 'Une éducation complète et équilibrée, de la maternelle au lycée.' },
    keywords:    { type: String, default: 'école internationale, Tanger, Badrane, éducation' },
  },
}, { timestamps: true })

module.exports = mongoose.model('Settings', settingsSchema)
