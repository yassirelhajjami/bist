import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

export default function TeachingEditor() {
  const toast = useToast()
  const { t } = useLanguage()
  const te = t.teaching

  const [fields, setFields] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    supabase.from('page_content').select('key, value').eq('page', 'teaching').then(({ data }) => {
      if (data) setFields(Object.fromEntries(data.map(r => [r.key, r.value])))
    }).finally(() => setLoading(false))
  }, [])

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const rows = Object.entries(fields).map(([key, value]) => ({ page: 'teaching', key, value }))
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
          <h1 className="text-2xl font-bold text-slate-800">{te.title}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{te.editDesc}</p>
        </div>
        <button type="submit" className="btn btn-primary shrink-0" disabled={saving}>
          {saving ? <Spinner size="sm" color="white" /> : t.common.save}
        </button>
      </div>

      <Section title={te.mainTexts}>
        <div>
          <label className="form-label">{te.p1Label}</label>
          <textarea value={fields.p1 || ''} onChange={set('p1')} rows={4} className="form-textarea" />
        </div>
        <div>
          <label className="form-label">{te.p2Label}</label>
          <textarea value={fields.p2 || ''} onChange={set('p2')} rows={3} className="form-textarea" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">{te.quoteLabel}</label>
            <textarea value={fields.quote || ''} onChange={set('quote')} rows={2} className="form-textarea" />
          </div>
          <div>
            <label className="form-label">{te.quoteAuthorLabel}</label>
            <input value={fields.quote_author || ''} onChange={set('quote_author')} className="form-input" />
          </div>
        </div>
      </Section>

      <Section title={te.methodsSection}>
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="space-y-2 bg-slate-50 p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{te.method} {n}</p>
              <input value={fields[`method_${n}_title`] || ''} onChange={set(`method_${n}_title`)} className="form-input" placeholder={te.methodTitle} />
              <textarea value={fields[`method_${n}_desc`] || ''} onChange={set(`method_${n}_desc`)} rows={2} className="form-textarea" placeholder={te.methodDesc} />
            </div>
          ))}
        </div>
      </Section>
    </form>
  )
}
