import { useState, useEffect } from 'react'
import api from '../../api/client'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

export default function HomepageEditor() {
  const toast = useToast()
  const { t } = useLanguage()
  const hp = t.homepage

  const [fields, setFields] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    api.get('/content/homepage').then(r => {
      const flat = {}
      Object.entries(r.data.data).forEach(([k, v]) => { flat[k] = v.value })
      setFields(flat)
    }).finally(() => setLoading(false))
  }, [])

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.patch('/content/homepage', fields)
      toast(t.common.success, 'success')
    } catch { toast(t.common.error, 'error') }
    finally { setSaving(false) }
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
        <div>
          <label className="form-label">{hp.heroTitle}</label>
          <input value={fields.hero_title || ''} onChange={set('hero_title')} className="form-input" />
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
