const supabase  = require('../config/supabase')
const { mapRow } = require('../utils/mapRow')

exports.list = async (req, res) => {
  const { status, category, page = 1, limit = 20, search } = req.query
  const offset = (page - 1) * +limit

  let query = supabase.from('posts').select('*', { count: 'exact' })
  if (status)   query = query.eq('status', status)
  if (category) query = query.eq('category', category)
  if (search)   query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + +limit - 1)

  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, data: data.map(mapRow), total: count, page: +page, pages: Math.ceil(count / +limit) })
}

exports.getOne = async (req, res) => {
  const { data, error } = await supabase.from('posts').select('*').eq('id', req.params.id).single()
  if (error || !data) return res.status(404).json({ success: false, message: 'Post not found' })
  res.json({ success: true, data: mapRow(data) })
}

exports.create = async (req, res) => {
  const { title, content, excerpt, coverImage, category, status, publishDate } = req.body
  const { data, error } = await supabase.from('posts').insert({
    title,
    content,
    excerpt,
    cover_image:  coverImage  || null,
    category:     category    || 'Actualité',
    status:       status      || 'draft',
    publish_date: publishDate || null,
    author_id:    req.user._id,
  }).select().single()

  if (error) return res.status(400).json({ success: false, message: error.message })
  res.status(201).json({ success: true, data: mapRow(data) })
}

exports.update = async (req, res) => {
  const { title, content, excerpt, coverImage, category, status, publishDate } = req.body
  const updates = { updated_at: new Date() }
  if (title       !== undefined) updates.title        = title
  if (content     !== undefined) updates.content      = content
  if (excerpt     !== undefined) updates.excerpt      = excerpt
  if (coverImage  !== undefined) updates.cover_image  = coverImage
  if (category    !== undefined) updates.category     = category
  if (status      !== undefined) updates.status       = status
  if (publishDate !== undefined) updates.publish_date = publishDate

  const { data, error } = await supabase
    .from('posts').update(updates).eq('id', req.params.id).select().single()
  if (error || !data) return res.status(404).json({ success: false, message: 'Post not found' })
  res.json({ success: true, data: mapRow(data) })
}

exports.remove = async (req, res) => {
  const { error } = await supabase.from('posts').delete().eq('id', req.params.id)
  if (error) return res.status(404).json({ success: false, message: 'Post not found' })
  res.json({ success: true, message: 'Post deleted' })
}

exports.toggleStatus = async (req, res) => {
  const { data: post, error } = await supabase.from('posts').select('*').eq('id', req.params.id).single()
  if (error || !post) return res.status(404).json({ success: false, message: 'Post not found' })

  const newStatus = post.status === 'published' ? 'draft' : 'published'
  const updates   = { status: newStatus, updated_at: new Date() }
  if (newStatus === 'published' && !post.publish_date) updates.publish_date = new Date()

  const { data, error: err2 } = await supabase
    .from('posts').update(updates).eq('id', req.params.id).select().single()
  if (err2) return res.status(500).json({ success: false, message: err2.message })
  res.json({ success: true, data: mapRow(data) })
}
