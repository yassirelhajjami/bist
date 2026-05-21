const supabase  = require('../config/supabase')
const { mapRow } = require('../utils/mapRow')

async function countRows(table, filter = {}) {
  let q = supabase.from(table).select('*', { count: 'exact', head: true })
  for (const [k, v] of Object.entries(filter)) q = q.eq(k, v)
  const { count } = await q
  return count || 0
}

exports.get = async (req, res) => {
  const [posts, published, drafts, gallery, events, upcoming, staff, submissions, unreadSubmissions] = await Promise.all([
    countRows('posts'),
    countRows('posts',   { status: 'published' }),
    countRows('posts',   { status: 'draft' }),
    countRows('gallery_images'),
    countRows('events'),
    countRows('events',  { status: 'upcoming' }),
    countRows('staff',   { is_active: true }),
    countRows('form_submissions'),
    countRows('form_submissions', { is_read: false }),
  ])

  const [{ data: rawPosts }, { data: rawEvents }] = await Promise.all([
    supabase.from('posts')
      .select('id, title, status, created_at, category')
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('events')
      .select('id, title, start_date, status')
      .order('start_date', { ascending: true }).limit(5),
  ])

  res.json({
    success: true,
    data: {
      counts:       { posts, published, drafts, gallery, events, upcoming, staff, submissions, unreadSubmissions },
      recentPosts:  (rawPosts  || []).map(mapRow),
      recentEvents: (rawEvents || []).map(mapRow),
    },
  })
}
