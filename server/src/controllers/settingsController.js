const supabase  = require('../config/supabase')
const { mapRow } = require('../utils/mapRow')

async function getOrCreate() {
  const { data } = await supabase.from('settings').select('*').limit(1).single()
  if (data) return data
  const { data: created } = await supabase.from('settings').insert({}).select().single()
  return created
}

exports.get = async (req, res) => {
  const settings = await getOrCreate()
  res.json({ success: true, data: mapRow(settings) })
}

exports.update = async (req, res) => {
  const settings = await getOrCreate()
  const { schoolName, schoolNameFull, primaryColor, secondaryColor, logo, contact, socialMedia, seo } = req.body

  const updates = { updated_at: new Date() }
  if (schoolName     !== undefined) updates.school_name      = schoolName
  if (schoolNameFull !== undefined) updates.school_name_full = schoolNameFull
  if (primaryColor   !== undefined) updates.primary_color    = primaryColor
  if (secondaryColor !== undefined) updates.secondary_color  = secondaryColor
  if (logo           !== undefined) updates.logo             = logo
  if (contact        !== undefined) updates.contact          = contact
  if (socialMedia    !== undefined) updates.social_media     = socialMedia
  if (seo            !== undefined) updates.seo              = seo

  const { data, error } = await supabase
    .from('settings').update(updates).eq('id', settings.id).select().single()
  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, data: mapRow(data) })
}
