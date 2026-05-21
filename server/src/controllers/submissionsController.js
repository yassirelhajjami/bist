const supabase  = require('../config/supabase')
const { mapRow } = require('../utils/mapRow')

exports.create = async (req, res) => {
  const { type, name, email, phone, subject, level, message, ...rest } = req.body
  if (!type || !['contact', 'registration'].includes(type))
    return res.status(400).json({ success: false, message: 'Invalid submission type' })

  const { data, error } = await supabase.from('form_submissions').insert({
    type,
    name:    name || null,
    email:   email || null,
    phone:   phone || null,
    subject: subject || null,
    level:   level || null,
    message: message || null,
    data:    rest,
  }).select().single()

  if (error) {
    console.error('Submission insert error:', error)
    return res.status(500).json({ success: false, message: 'Could not save submission' })
  }
  res.status(201).json({ success: true, data: mapRow(data) })
}

exports.list = async (req, res) => {
  const { type, is_read, page = 1, limit = 50 } = req.query
  const from = (page - 1) * limit
  const to   = from + Number(limit) - 1

  let q = supabase.from('form_submissions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (type)    q = q.eq('type', type)
  if (is_read !== undefined) q = q.eq('is_read', is_read === 'true')

  const { data, count, error } = await q
  if (error) return res.status(500).json({ success: false, message: error.message })

  res.json({ success: true, data: (data || []).map(mapRow), total: count || 0 })
}

exports.markRead = async (req, res) => {
  const { id } = req.params
  const { is_read, isRead } = req.body
  const value = is_read !== undefined ? is_read : (isRead !== undefined ? isRead : true)
  const { data, error } = await supabase
    .from('form_submissions').update({ is_read: value }).eq('id', id).select().single()
  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, data: mapRow(data) })
}

exports.remove = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('form_submissions').delete().eq('id', id)
  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true })
}

exports.unreadCount = async (req, res) => {
  const { count } = await supabase
    .from('form_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)
  res.json({ success: true, count: count || 0 })
}
