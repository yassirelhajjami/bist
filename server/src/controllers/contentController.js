const supabase = require('../config/supabase')

const ALLOWED_PAGES = ['homepage', 'admissions', 'about', 'teaching', 'levels']

const DEFAULTS = {
  about: [
    { key: 'p1',            value: "Fondée avec la vision d'offrir une éducation internationale de qualité au Maroc, l'École Badrane de Tanger s'est imposée comme un établissement de référence. Nous croyons que chaque enfant possède un potentiel unique qui mérite d'être cultivé.", label: 'Paragraphe 1', type: 'richtext' },
    { key: 'p2',            value: "Notre approche pédagogique combine le meilleur des programmes nationaux et internationaux, avec une attention particulière portée au développement des compétences du 21ème siècle : esprit critique, créativité, collaboration et communication.", label: 'Paragraphe 2', type: 'richtext' },
    { key: 'mission_title', value: "Notre Mission", label: 'Titre Mission', type: 'text' },
    { key: 'mission_text',  value: "Former des citoyens du monde responsables, curieux et épanouis, capables de relever les défis du XXIe siècle.", label: 'Texte Mission', type: 'richtext' },
    { key: 'value_1_title', value: "Innovation Pédagogique",   label: 'Valeur 1 — Titre',       type: 'text' },
    { key: 'value_1_desc',  value: "Nous adoptons les méthodes d'enseignement les plus modernes pour stimuler la curiosité et la créativité.", label: 'Valeur 1 — Description', type: 'text' },
    { key: 'value_2_title', value: "Ouverture Internationale", label: 'Valeur 2 — Titre',       type: 'text' },
    { key: 'value_2_desc',  value: "Un enseignement multilingue et multiculturel qui prépare les élèves à un monde globalisé.", label: 'Valeur 2 — Description', type: 'text' },
    { key: 'value_3_title', value: "Bien-être de l'Élève",    label: 'Valeur 3 — Titre',       type: 'text' },
    { key: 'value_3_desc',  value: "L'épanouissement personnel et social de chaque enfant est au cœur de notre mission éducative.", label: 'Valeur 3 — Description', type: 'text' },
    { key: 'value_4_title', value: "Équipe Qualifiée",         label: 'Valeur 4 — Titre',       type: 'text' },
    { key: 'value_4_desc',  value: "Des enseignants passionnés et expérimentés, dévoués à la réussite de chaque élève.", label: 'Valeur 4 — Description', type: 'text' },
  ],
  teaching: [
    { key: 'p1',            value: "Notre philosophie pédagogique s'appuie sur les recherches les plus récentes en sciences de l'éducation. Nous mettons en œuvre des pratiques innovantes qui rendent les apprentissages plus engageants, plus durables et plus efficaces.", label: 'Paragraphe 1', type: 'richtext' },
    { key: 'p2',            value: "Nos enseignants bénéficient d'une formation continue et sont encouragés à innover constamment dans leurs pratiques de classe.", label: 'Paragraphe 2', type: 'richtext' },
    { key: 'quote',         value: "Éduquer c'est allumer un feu, non remplir un vase.", label: 'Citation', type: 'text' },
    { key: 'quote_author',  value: "Aristophane", label: 'Auteur de la citation', type: 'text' },
    { key: 'method_1_title', value: "Apprentissage Actif",     label: 'Méthode 1 — Titre', type: 'text' },
    { key: 'method_1_desc',  value: "Fini les cours magistraux passifs. Nos élèves sont au cœur de l'apprentissage : expérimentations, débats, projets collaboratifs.", label: 'Méthode 1 — Description', type: 'text' },
    { key: 'method_2_title', value: "Pédagogie Différenciée",  label: 'Méthode 2 — Titre', type: 'text' },
    { key: 'method_2_desc',  value: "Chaque enfant apprend différemment. Nos enseignants adaptent leur approche à chaque profil d'apprenant pour une efficacité maximale.", label: 'Méthode 2 — Description', type: 'text' },
    { key: 'method_3_title', value: "Numérique & Innovation",  label: 'Méthode 3 — Titre', type: 'text' },
    { key: 'method_3_desc',  value: "Salles équipées, outils numériques intégrés, coding et robotique : nous préparons les élèves au monde de demain.", label: 'Méthode 3 — Description', type: 'text' },
    { key: 'method_4_title', value: "Évaluation Bienveillante", label: 'Méthode 4 — Titre', type: 'text' },
    { key: 'method_4_desc',  value: "L'erreur est une étape dans l'apprentissage. Notre approche valorise les progrès, la persévérance et le dépassement de soi.", label: 'Méthode 4 — Description', type: 'text' },
    { key: 'method_5_title', value: "Multilinguisme",           label: 'Méthode 5 — Titre', type: 'text' },
    { key: 'method_5_desc',  value: "Arabe, français et anglais — un trilinguisme dès le plus jeune âge qui ouvre des portes dans le monde entier.", label: 'Méthode 5 — Description', type: 'text' },
    { key: 'method_6_title', value: "Arts & Culture",           label: 'Méthode 6 — Titre', type: 'text' },
    { key: 'method_6_desc',  value: "Musique, arts plastiques, théâtre et sport : une éducation complète qui développe toutes les dimensions de la personnalité.", label: 'Méthode 6 — Description', type: 'text' },
  ],
  levels: [
    { key: 'section_subtitle',    value: "Un parcours éducatif complet et cohérent, conçu pour accompagner chaque élève à chaque étape de son développement.", label: 'Sous-titre de la section', type: 'text' },
    { key: 'maternelle_name',     value: "Maternelle", label: 'Maternelle — Nom', type: 'text' },
    { key: 'maternelle_ages',     value: "3 – 5 ans",  label: 'Maternelle — Âges', type: 'text' },
    { key: 'maternelle_desc',     value: "Un environnement bienveillant et stimulant pour les premiers apprentissages. Nos éducateurs spécialisés accompagnent chaque enfant dans sa découverte du monde.", label: 'Maternelle — Description', type: 'richtext' },
    { key: 'maternelle_features', value: "Éveil sensoriel et moteur\nInitiation aux langues\nActivités créatives et artistiques\nDéveloppement socio-émotionnel", label: 'Maternelle — Points (1 par ligne)', type: 'richtext' },
    { key: 'primaire_name',       value: "Primaire",   label: 'Primaire — Nom', type: 'text' },
    { key: 'primaire_ages',       value: "6 – 11 ans", label: 'Primaire — Âges', type: 'text' },
    { key: 'primaire_desc',       value: "Des bases solides dans un cadre engageant. Notre programme primaire développe la curiosité intellectuelle et les compétences fondamentales.", label: 'Primaire — Description', type: 'richtext' },
    { key: 'primaire_features',   value: "Programme national enrichi\nTrilinguisme (Fr/Ar/An)\nActivités parascolaires\nSuivi personnalisé", label: 'Primaire — Points (1 par ligne)', type: 'richtext' },
    { key: 'college_name',        value: "Collège",    label: 'Collège — Nom', type: 'text' },
    { key: 'college_ages',        value: "12 – 14 ans", label: 'Collège — Âges', type: 'text' },
    { key: 'college_desc',        value: "Le collège Badrane prépare les élèves aux défis académiques supérieurs tout en cultivant leur esprit critique et leur autonomie.", label: 'Collège — Description', type: 'richtext' },
    { key: 'college_features',    value: "Sciences & Technologie\nProjets interdisciplinaires\nOrientation & coaching\nClubs et activités", label: 'Collège — Points (1 par ligne)', type: 'richtext' },
    { key: 'lycee_name',          value: "Lycée",      label: 'Lycée — Nom', type: 'text' },
    { key: 'lycee_ages',          value: "15 – 18 ans", label: 'Lycée — Âges', type: 'text' },
    { key: 'lycee_desc',          value: "Préparation d'excellence au baccalauréat et aux grandes études supérieures. Nos lycéens sont accompagnés vers leurs projets d'avenir.", label: 'Lycée — Description', type: 'richtext' },
    { key: 'lycee_features',      value: "Baccalauréat marocain\nPréparation aux concours\nOrientation université\nÉchanges internationaux", label: 'Lycée — Points (1 par ligne)', type: 'richtext' },
  ],
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
  if (!ALLOWED_PAGES.includes(page))
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
