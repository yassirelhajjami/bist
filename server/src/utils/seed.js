require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })
const bcrypt = require('bcryptjs')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function seed() {
  console.log('Seeding Supabase database...')

  const password = await bcrypt.hash('Admin@2024!', 12)
  const { data: user, error: userErr } = await supabase
    .from('users')
    .upsert(
      { name: 'Admin', email: 'admin@badraneschool.ma', password, role: 'admin', is_active: true },
      { onConflict: 'email' }
    )
    .select('email, role')
    .single()

  if (userErr) console.error('  User error:', userErr.message)
  else console.log(`  Admin user ready: ${user.email} (${user.role})`)

  const { data: existing } = await supabase.from('settings').select('id').limit(1).single()
  if (!existing) {
    await supabase.from('settings').insert({})
    console.log('  Default settings row created')
  } else {
    console.log('  Settings row already exists')
  }

  console.log('\nDone! Login with:')
  console.log('  Email:    admin@badraneschool.ma')
  console.log('  Password: Admin@2024!')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
