import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

export default function HomepageEditor() {
  const toast = useToast()
  const { t } = useLanguage()
  const hp = t.homepage
  const fileRef = useRef()

  const [fields, setFields]       = useState({})
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.from('page_content').select('key, value').eq('page', 'homepage').then(({ data }) => {
      if (data) setFields(Object.fromEntries(data.map(r => [r.key, r.value])))
    }).finally(() => setLoading(false))
  }, [])

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const rows = Object.entries(fields).map(([key, value]) => ({ page: 'homepage', key, value }))
      const { error } = await supabase.from('page_content').upsert(rows, { onConflict: 'page,key' })
      if (error) throw error
      toast(t.common.success, 'success')
    } catch { toast(t.common.error, 'error') }
    finally { setSaving(false) }
  }

  async function uploadBgImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const ext  = file.name.split('.').pop()
      const path = `hero-bg/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('media').upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
      const newFields = { ...fields, hero_bg_image: publicUrl }
      setFields(newFields)
      const { error: dbErr } = await supabase.from('page_content').upsert(
        [{ page: 'homepage', key: 'hero_bg_image', value: publicUrl }],
        { onConflict: 'page,key' }
      )
      if (dbErr) throw dbErr
      toast(t.common.success, 'success')
    } catch { toast(t.common.error, 'error') }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  async function removeBgImage() {
    const newFields = { ...fields, hero_bg_image: '' }
    setFields(newFields)
    await supabase.from('page_content').upsert(
      [{ page: 'homepage', key: 'hero_bg_image', value: '' }],
      { onConflict: 'page,key' }
    )
    toast(t.common.success, 'success')
  }

  function set(k) { return e => setFields(f => ({ ...f, [k]: e.target.value })) }

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  const Section = ({ num, title, children }) => (
    <div className="card">
      <div className="card-header">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-6 h-6 bg-navy-900 text-white rounded flex items-center justify-center text-xs font-bold">{num}</span>
          {title}
        </h2>
      </div>
      <div className="card-body space-y-4">{children}</div>
    </div>
  )

  return (
    <form onSubmit={save} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{hp.title}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{hp.editDesc}</p>
        </div>
        <button type="submit" className="btn btn-primary shrink-0" disabled={saving}>
          {saving ? <Spinner size="sm" color="white" /> : t.common.save}
        </button>
      </div>

      <Section num="1" title={hp.heroSection}>
        {/* Hero background image */}
        <div>
          <label className="form-label">Image de fond du Hero</label>
          {fields.hero_bg_image ? (
            <div className="relative rounded-xl overflow-hidden mb-3" style={{ height: 180 }}>
              <img src={fields.hero_bg_image} alt="Hero background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-navy-950/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={removeBgImage}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer l'image
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center mb-3" style={{ height: 120 }}>
              <p className="text-slate-400 text-sm">Aucune image — dégradé par défaut affiché</p>
            </div>
          )}
          <label className={`btn btn-secondary cursor-pointer ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
            {uploading ? <Spinner size="sm" /> : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {fields.hero_bg_image ? 'Changer l\'image' : 'Ajouter une image de fond'}
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadBgImage} />
          </label>
        </div>

        <div>
          <label className="form-label">{hp.heroTitle}</label>
          <input value={fields.hero_title || ''} onChange={set('hero_title')} className="form-input" placeholder="L'Excellence Internationale à Tanger" />
          <p className="text-xs text-slate-400 mt-1">Laissez vide pour utiliser le titre par défaut avec mise en forme</p>
        </div>
        <div>
          <label className="form-label">{hp.heroSubtitle}</label>
          <textarea value={fields.hero_subtitle || ''} onChange={set('hero_subtitle')} rows={2} className="form-textarea" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">{hp.heroCTAPrimary}</label>
            <input value={fields.hero_cta_primary || ''} onChange={set('hero_cta_primary')} className="form-input" />
          </div>
          <div>
            <label className="form-label">{hp.heroCTASecondary}</label>
            <input value={fields.hero_cta_secondary || ''} onChange={set('hero_cta_secondary')} className="form-input" />
          </div>
        </div>
      </Section>

      <Section num="2" title={hp.statsSection}>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="form-label">{hp.statLevels}</label>
            <input value={fields.stat_levels || ''} onChange={set('stat_levels')} className="form-input" placeholder="4" />
          </div>
          <div>
            <label className="form-label">{hp.statYears}</label>
            <input value={fields.stat_years || ''} onChange={set('stat_years')} className="form-input" placeholder="20+" />
          </div>
          <div>
            <label className="form-label">{hp.statStudents}</label>
            <input value={fields.stat_students || ''} onChange={set('stat_students')} className="form-input" placeholder="500+" />
          </div>
        </div>
      </Section>

      <Section num="3" title={hp.aboutSection}>
        <div>
          <label className="form-label">{hp.aboutTitle}</label>
          <input value={fields.about_title || ''} onChange={set('about_title')} className="form-input" />
        </div>
        <div>
          <label className="form-label">{hp.aboutText}</label>
          <textarea value={fields.about_text || ''} onChange={set('about_text')} rows={5} className="form-textarea" />
        </div>
      </Section>
    </form>
  )
}
