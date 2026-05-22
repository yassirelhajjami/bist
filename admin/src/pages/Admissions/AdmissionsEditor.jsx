import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import MediaUpload from '../../components/MediaUpload'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

export default function AdmissionsEditor() {
  const toast = useToast()
  const { t } = useLanguage()
  const ad = t.admissions

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

  return (
    <form onSubmit={save} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{ad.title}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{ad.editDesc}</p>
        </div>
        <button type="submit" className="btn btn-primary shrink-0" disabled={saving}>
          {saving ? <Spinner size="sm" color="white" /> : t.common.save}
        </button>
      </div>

      <div className="card card-body space-y-4">
        <div>
          <label className="form-label">{ad.sectionTitle}</label>
          <input value={fields.title || ''} onChange={set('title')} className="form-input" />
        </div>
        <div>
          <label className="form-label">{ad.subtitle}</label>
          <textarea value={fields.subtitle || ''} onChange={set('subtitle')} rows={2} className="form-textarea" />
        </div>
      </div>

      <div className="card card-body space-y-4">
        <div>
          <label className="form-label">{ad.processText}</label>
          <textarea value={fields.process_text || ''} onChange={set('process_text')} rows={6} className="form-textarea" placeholder={ad.processHint} />
        </div>
        <div>
          <label className="form-label">{ad.tuitionText}</label>
          <textarea value={fields.tuition_text || ''} onChange={set('tuition_text')} rows={4} className="form-textarea" placeholder={ad.tuitionHint} />
        </div>
      </div>

      <div className="card card-body space-y-4">
        <h3 className="font-semibold text-slate-700">{ad.docsLinks}</h3>
        <div>
          <label className="form-label">{ad.brochureUrl}</label>
          <input value={fields.brochure_url || ''} onChange={set('brochure_url')} className="form-input" type="url" placeholder="https://..." />
        </div>
        <div>
          <label className="form-label">{ad.enrollmentUrl}</label>
          <input value={fields.enrollment_form_url || ''} onChange={set('enrollment_form_url')} className="form-input" type="url" placeholder="https://..." />
        </div>
        <div className="pt-2 border-t border-slate-100">
          <MediaUpload
            value={fields.brochure_pdf || ''}
            onChange={url => setFields(f => ({ ...f, brochure_pdf: url }))}
            subdir="documents"
            accept=".pdf,image/*"
            label={ad.brochureUpload}
            helpText="PDF, JPG, PNG — max 10MB"
          />
          {fields.brochure_pdf && (
            <p className="text-xs text-slate-400 mt-1">
              {ad.viewFile} : <a href={fields.brochure_pdf} target="_blank" rel="noopener noreferrer" className="text-navy-600 underline">{fields.brochure_pdf.split('/').pop()}</a>
            </p>
          )}
        </div>
      </div>
    </form>
  )
}
