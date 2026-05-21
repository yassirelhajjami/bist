const jwt     = require('jsonwebtoken')
const bcrypt  = require('bcryptjs')
const supabase = require('../config/supabase')
const { mapRow } = require('../utils/mapRow')

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required' })

  const { data: user } = await supabase
    .from('users').select('*').eq('email', email.toLowerCase()).single()

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ success: false, message: 'Invalid credentials' })

  if (!user.is_active)
    return res.status(403).json({ success: false, message: 'Account disabled' })

  await supabase.from('users').update({ last_login: new Date() }).eq('id', user.id)

  res.json({ success: true, token: signToken(user.id), user: mapRow(user) })
}

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user })
}

exports.updateMe = async (req, res) => {
  const { name, email } = req.body
  const updates = {}
  if (name)  updates.name  = name
  if (email) updates.email = email.toLowerCase()

  const { data, error } = await supabase
    .from('users').update(updates).eq('id', req.user._id).select().single()
  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, user: mapRow(data) })
}

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const { data: user } = await supabase
    .from('users').select('password').eq('id', req.user._id).single()

  if (!(await bcrypt.compare(currentPassword, user.password)))
    return res.status(400).json({ success: false, message: 'Current password is incorrect' })

  const hashed = await bcrypt.hash(newPassword, 12)
  await supabase.from('users').update({ password: hashed }).eq('id', req.user._id)
  res.json({ success: true, message: 'Password updated successfully' })
}

exports.listUsers = async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, is_active, last_login, created_at')
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, data: data.map(mapRow) })
}

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body
  const hashed = await bcrypt.hash(password, 12)
  const { data, error } = await supabase.from('users').insert({
    name, email: email.toLowerCase(), password: hashed, role: role || 'editor',
  }).select('id, name, email, role, is_active, created_at').single()
  if (error) return res.status(400).json({ success: false, message: error.message })
  res.status(201).json({ success: true, data: mapRow(data) })
}

exports.updateUser = async (req, res) => {
  const { password, ...updates } = req.body
  const { data, error } = await supabase
    .from('users').update(updates).eq('id', req.params.id)
    .select('id, name, email, role, is_active').single()
  if (error || !data) return res.status(404).json({ success: false, message: 'User not found' })
  res.json({ success: true, data: mapRow(data) })
}

exports.deleteUser = async (req, res) => {
  if (req.params.id === req.user._id)
    return res.status(400).json({ success: false, message: 'Cannot delete your own account' })
  await supabase.from('users').delete().eq('id', req.params.id)
  res.json({ success: true, message: 'User deleted' })
}
