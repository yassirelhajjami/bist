// Maps Supabase snake_case DB columns → camelCase API fields
// and renames `id` → `_id` so the frontend keeps working without changes.

const SNAKE_TO_CAMEL = {
  cover_image:      'coverImage',
  publish_date:     'publishDate',
  start_date:       'startDate',
  end_date:         'endDate',
  banner_image:     'bannerImage',
  is_active:        'isActive',
  is_read:          'isRead',
  original_name:    'originalName',
  thumbnail_url:    'thumbnailUrl',
  display_order:    'order',
  school_name:      'schoolName',
  school_name_full: 'schoolNameFull',
  primary_color:    'primaryColor',
  secondary_color:  'secondaryColor',
  social_media:     'socialMedia',
  created_at:       'createdAt',
  updated_at:       'updatedAt',
  last_login:       'lastLogin',
  uploaded_by:      'uploadedBy',
  author_id:        'author',
  created_by:       'createdBy',
}

function mapRow(row) {
  if (!row) return null
  const out = {}
  for (const [k, v] of Object.entries(row)) {
    if (k === 'id')       { out._id = v; continue }
    if (k === 'password') { continue }           // never expose
    out[SNAKE_TO_CAMEL[k] ?? k] = v
  }
  return out
}

module.exports = { mapRow }
