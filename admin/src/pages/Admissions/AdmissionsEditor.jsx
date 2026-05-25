import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

export default function AdmissionsEditor() {
  const toast = useToast()
  const { t } = useLanguage()

  const [fields, setFields] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    supabase.from('page_content').select('key, value').eq('page', 'admissions').then(({ data }) => {
      if (data) setFields(Object.fromEntries(data.map(r => [r.key, r.value])))
    }).finally(() => setLoading(false))
  }, [])

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const rows = Object.entries(fields).map(([key, value]) => ({ page: 'admissions', key, value }))
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
          <h1 className="text-2xl font-bold text-slate-800">Section Admissions</h1>
          <p className="text-slate-500 text-sm mt-0.5">Modifiez le contenu affiché dans la section Admissions</p>
        </div>
        <button type="submit" className="btn btn-primary shrink-0" disabled={saving}>
          {saving ? <Spinner size="sm" color="white" /> : t.common.save}
        </button>
      </div>

      <Section title="Texte principal">
        <div>
          <label className="form-label">Titre de la section</label>
          <input value={fields.section_title || ''} onChange={set('section_title')} className="form-input" placeholder="Rejoignez la famille" />
        </div>
        <div>
          <label className="form-label">Sous-titre</label>
          <textarea value={fields.subtitle || ''} onChange={set('subtitle')} rows={2} className="form-textarea" />
        </div>
      </Section>

      <Section title="Étapes d'inscription">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="bg-slate-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Étape {n}</p>
            <input value={fields[`step_${n}_title`] || ''} onChange={set(`step_${n}_title`)} className="form-input" placeholder="Titre de l'étape" />
            <textarea value={fields[`step_${n}_desc`] || ''} onChange={set(`step_${n}_desc`)} rows={2} className="form-textarea" placeholder="Description de l'étape" />
          </div>
        ))}
      </Section>

      <Section title="Documents requis">
        <p className="text-xs text-slate-400">Un document par ligne de formulaire</p>
        {[1, 2, 3, 4, 5, 6].map(n => (
          <div key={n} className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 w-4 shrink-0">{n}.</span>
            <input value={fields[`doc_${n}`] || ''} onChange={set(`doc_${n}`)} className="form-input flex-1" placeholder={`Document ${n}`} />
          </div>
        ))}
      </Section>
    </form>
  )
}
