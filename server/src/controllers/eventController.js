const supabase  = require('../config/supabase')
const { mapRow } = require('../utils/mapRow')

exports.list = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query
  const offset = (page - 1) * +limit

  let query = supabase.from('events').select('*', { count: 'exact' })
  if (status) query = query.eq('status', status)

  const { data, count, error } = await query
    .order('start_date', { ascending: true })
    .range(offset, offset + +limit - 1)

  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, data: data.map(mapRow), total: count, page: +page, pages: Math.ceil(count / +limit) })
}

exports.getOne = async (req, res) => {
  const { data, error } = await supabase.from('events').select('*').eq('id', req.params.id).single()
  if (error || !data) return res.status(404).json({ success: false, message: 'Event not found' })
  res.json({ success: true, data: mapRow(data) })
}

exports.create = async (req, res) => {
  const { title, description, startDate, endDate, location, bannerImage } = req.body
  const { data, error } = await supabase.from('events').insert({
    title,
    description,
    start_date:   startDate,
    end_date:     endDate      || null,
    location:     location     || '',
    banner_image: bannerImage  || null,
    status:       'upcoming',
    created_by:   req.user._id,
  }).select().single()

  if (error) return res.status(400).json({ success: false, message: error.message })
  res.status(201).json({ success: true, data: mapRow(data) })
}

exports.update = async (req, res) => {
  const { title, description, startDate, endDate, location, bannerImage, status } = req.body
  const updates = { updated_at: new Date() }
  if (title       !== undefined) updates.title        = title
  if (description !== undefined) updates.description  = description
  if (startDate   !== undefined) updates.start_date   = startDate
  if (endDate     !== undefined) updates.end_date     = endDate
  if (location    !== undefined) updates.location     = location
  if (bannerImage !== undefined) updates.banner_image = bannerImage
  if (status      !== undefined) updates.status       = status

  const { data, error } = await supabase
    .from('events').update(updates).eq('id', req.params.id).select().single()
  if (error || !data) return res.status(404).json({ success: false, message: 'Event not found' })
  res.json({ success: true, data: mapRow(data) })
}

exports.remove = async (req, res) => {
  const { error } = await supabase.from('events').delete().eq('id', req.params.id)
  if (error) return res.status(404).json({ success: false, message: 'Event not found' })
  res.json({ success: true, message: 'Event deleted' })
}
