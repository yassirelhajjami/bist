const supabase  = require('../config/supabase')
const { mapRow } = require('../utils/mapRow')

exports.list = async (req, res) => {
  const { department, isActive } = req.query
  let query = supabase.from('staff').select('*')
  if (department) query = query.eq('department', department)
  if (isActive !== undefined) query = query.eq('is_active', isActive === 'true')

  const { data, error } = await query
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, data: data.map(mapRow) })
}

exports.getOne = async (req, res) => {
  const { data, error } = await supabase.from('staff').select('*').eq('id', req.params.id).single()
  if (error || !data) return res.status(404).json({ success: false, message: 'Staff member not found' })
  res.json({ success: true, data: mapRow(data) })
}

exports.create = async (req, res) => {
  const { name, position, department, bio, photo, email, phone, order, isActive } = req.body
  const { data, error } = await supabase.from('staff').insert({
    name,
    position,
    department:    department || 'Administration',
    bio:           bio        || '',
    photo:         photo      || null,
    email:         email      || '',
    phone:         phone      || '',
    display_order: order      ?? 0,
    is_active:     isActive   ?? true,
  }).select().single()

  if (error) return res.status(400).json({ success: false, message: error.message })
  res.status(201).json({ success: true, data: mapRow(data) })
}

exports.update = async (req, res) => {
  const { name, position, department, bio, photo, email, phone, order, isActive } = req.body
  const updates = { updated_at: new Date() }
  if (name       !== undefined) updates.name          = name
  if (position   !== undefined) updates.position      = position
  if (department !== undefined) updates.department    = department
  if (bio        !== undefined) updates.bio           = bio
  if (photo      !== undefined) updates.photo         = photo
  if (email      !== undefined) updates.email         = email
  if (phone      !== undefined) updates.phone         = phone
  if (order      !== undefined) updates.display_order = order
  if (isActive   !== undefined) updates.is_active     = isActive

  const { data, error } = await supabase
    .from('staff').update(updates).eq('id', req.params.id).select().single()
  if (error || !data) return res.status(404).json({ success: false, message: 'Staff member not found' })
  res.json({ success: true, data: mapRow(data) })
}

exports.remove = async (req, res) => {
  const { error } = await supabase.from('staff').delete().eq('id', req.params.id)
  if (error) return res.status(404).json({ success: false, message: 'Staff member not found' })
  res.json({ success: true, message: 'Staff member deleted' })
}

exports.reorder = async (req, res) => {
  const { items } = req.body
  await Promise.all(
    items.map(({ id, order }) => supabase.from('staff').update({ display_order: order }).eq('id', id))
  )
  res.json({ success: true, message: 'Order updated' })
}
