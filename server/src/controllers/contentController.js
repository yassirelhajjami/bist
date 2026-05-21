const supabase = require('../config/supabase')

const DEFAULTS = {
  homepage: [
    { key: 'hero_title',          value: "L'Excellence Internationale à Tanger",                         label: 'Titre Hero',            type: 'text'     },
    { key: 'hero_subtitle',       value: "De la maternelle au lycée, une éducation complète.",           label: 'Sous-titre Hero',       type: 'text'     },
    { key: 'hero_cta_primary',    value: "S'inscrire maintenant",                                        label: 'Bouton CTA Principal',  type: 'text'     },
    { key: 'hero_cta_secondary',  value: "Découvrir l'école",                                            label: 'Bouton CTA Secondaire', type: 'text'     },
    { key: 'about_title',         value: "Une école qui place l'élève au centre",                        label: 'Titre À Propos',        type: 'text'     },
    { key: 'about_text',          value: "Fondée avec la vision d'offrir une éducation internationale.", label: 'Texte À Propos',        type: 'richtext' },
    { key: 'stat_levels',         value: '4',    label: 'Stat: Niveaux',  type: 'text' },
    { key: 'stat_years',          value: '20+',  label: 'Stat: Années',   type: 'text' },
    { key: 'stat_students',       value: '500+', label: 'Stat: Élèves',   type: 'text' },
  ],
  admissions: [
    { key: 'title',               value: 'Rejoignez la famille Badrane',                      label: 'Titre Admissions', type: 'text'     },
    { key: 'subtitle',            value: "Les inscriptions sont ouvertes pour l'année scolaire.", label: 'Sous-titre',  type: 'text'     },
    { key: 'process_text',        value: '',  label: "Texte processus d'inscription", type: 'richtext' },
    { key: 'tuition_text',        value: '',  label: 'Informations frais scolaires',  type: 'richtext' },
    { key: 'brochure_url',        value: '',  label: 'Lien brochure PDF',             type: 'url'      },
    { key: 'enrollment_form_url', value: '',  label: "Lien formulaire d'inscription", type: 'url'      },
  ],
}

exports.getPage = async (req, res) => {
  const { page } = req.params
  if (!['homepage', 'admissions'].includes(page))
    return res.status(400).json({ success: false, message: 'Invalid page' })

  let { data: items } = await supabase
    .from('page_content').select('*').eq('page', page).order('key', { ascending: true })

  if (!items || items.length === 0) {
    const { data: inserted } = await supabase
      .from('page_content')
      .insert(DEFAULTS[page].map(d => ({ page, ...d })))
      .select()
    items = inserted || []
  }

  const data = {}
  items.forEach(item => {
    data[item.key] = { value: item.value, label: item.label, type: item.type, _id: item.id }
  })
  res.json({ success: true, data })
}

exports.updatePage = async (req, res) => {
  const { page } = req.params
  const updates  = req.body

  const rows = Object.entries(updates).map(([key, value]) => ({
    page, key, value, updated_at: new Date().toISOString(),
  }))
  await supabase.from('page_content').upsert(rows, { onConflict: 'page,key' })

  const { data: items } = await supabase.from('page_content').select('*').eq('page', page)
  const data = {}
  ;(items || []).forEach(item => {
    data[item.key] = { value: item.value, label: item.label, type: item.type, _id: item.id }
  })
  res.json({ success: true, data })
}
