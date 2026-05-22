import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

export default function AboutEditor() {
  const toast = useToast()
  const { t } = useLanguage()
  const ab = t.about

  const [fields, setFields] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    supabase.from('page_content').select('key, value').eq('page', 'about').then(({ data }) => {
      if (data) setFields(Object.fromEntries(data.map(r => [r.key, r.value])))
    }).finally(() => setLoading(false))
  }, [])

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const rows = Object.entries(fields).map(([key, value]) => ({ page: 'about', key, value }))
      const { error } = await supabase.from('page_content').upsert(rows, { onConflict: 'page,key' })
      if (error) throw error
      toast(t.common.success, 'success')
    } catch { toast(t.common.error, 'error') }
    finally { setSaving(false) }
  }

  function set(k) { return e => setFields(f => ({ ...f, [k]: e.target.value })) }

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  const Section = ({ title, children }) => (
    <div className="card card-body space-y-4">
      <h3 className="font-semibold text-slate-700 border-b pb-2">{title}</h3>
      {children}
    </div>
  )

  return (
    <form onSubmit={save} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{ab.title}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{ab.editDesc}</p>
        </div>
        <button type="submit" className="btn btn-primary shrink-0" disabled={saving}>
          {saving ? <Spinner size="sm" color="white" /> : t.common.save}
        </button>
      </div>

      <Section title={ab.mainTexts}>
        <div>
          <label className="form-label">{ab.p1Label}</label>
          <textarea value={fields.p1 || ''} onChange={set('p1')} rows={4} className="form-textarea" />
        </div>
        <div>
          <label className="form-label">{ab.p2Label}</label>
          <textarea value={fields.p2 || ''} onChange={set('p2')} rows={4} className="form-textarea" />
        </div>
      </Section>

      <Section title={ab.missionBox}>
        <div>
          <label className="form-label">{ab.missionTitle}</label>
          <input value={fields.mission_title || ''} onChange={set('mission_title')} className="form-input" />
        </div>
        <div>
          <label className="form-label">{ab.missionText}</label>
          <textarea value={fields.mission_text || ''} onChange={set('mission_text')} rows={3} className="form-textarea" />
        </div>
      </Section>

      <Section title={ab.valuesSection}>
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="space-y-2 bg-slate-50 p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{ab.value} {n}</p>
              <input value={fields[`value_${n}_title`] || ''} onChange={set(`value_${n}_title`)} className="form-input" placeholder={ab.valueTitle} />
              <textarea value={fields[`value_${n}_desc`] || ''} onChange={set(`value_${n}_desc`)} rows={2} className="form-textarea" placeholder={ab.valueDesc} />
            </div>
          ))}
        </div>
      </Section>
    </form>
  )
}
