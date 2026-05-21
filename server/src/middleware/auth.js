const jwt      = require('jsonwebtoken')
const supabase  = require('../config/supabase')
const { mapRow } = require('../utils/mapRow')

async function protect(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Not authorized' })

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, role, is_active')
      .eq('id', decoded.id)
      .single()

    if (!user) return res.status(401).json({ success: false, message: 'User not found' })
    req.user = mapRow(user)
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ success: false, message: 'Insufficient permissions' })
    next()
  }
}

module.exports = { protect, authorize }
