import { useState, useEffect } from 'react'
import api from '../../api/client'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

const LEVEL_KEYS = ['maternelle', 'primaire', 'college', 'lycee']
const LEVEL_COLORS = ['bg-amber-500', 'bg-emerald-500', 'bg-blue-600', 'bg-crimson-600']

export default function LevelsEditor() {
  const toast = useToast()
  const { t } = useLanguage()
  const lv = t.levels

  const [fields, setFields] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    api.get('/content/levels').then(r => {
      const flat = {}
      Object.entries(r.data.data).forEach(([k, v]) => { flat[k] = v.value })
      setFields(flat)
    }).finally(() => setLoading(false))
  }, [])

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.patch('/content/levels', fields)
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
          <h1 className="text-2xl font-bold text-slate-800">{lv.title}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{lv.editDesc}</p>
        </div>
        <button type="submit" className="btn btn-primary shrink-0" disabled={saving}>
          {saving ? <Spinner size="sm" color="white" /> : t.common.save}
        </button>
      </div>

      <div className="card card-body">
        <h3 className="font-semibold text-slate-700 border-b pb-2 mb-3">{lv.sectionHeader}</h3>
        <div>
          <label className="form-label">{lv.sectionSubtitle}</label>
          <input value={fields.section_subtitle || ''} onChange={set('section_subtitle')} className="form-input" />
        </div>
      </div>

      {LEVEL_KEYS.map((key, i) => (
        <div key={key} className="card card-body space-y-4">
          <div className="flex items-center gap-3 border-b pb-2">
            <div className={`w-3 h-3 rounded-full ${LEVEL_COLORS[i]}`} />
            <h3 className="font-semibold text-slate-700">{fields[`${key}_name`] || key}</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{lv.levelName}</label>
              <input value={fields[`${key}_name`] || ''} onChange={set(`${key}_name`)} className="form-input" />
            </div>
            <div>
              <label className="form-label">{lv.levelAges}</label>
              <input value={fields[`${key}_ages`] || ''} onChange={set(`${key}_ages`)} className="form-input" placeholder="6 – 11 ans" />
            </div>
          </div>
          <div>
            <label className="form-label">{lv.levelDesc}</label>
            <textarea value={fields[`${key}_desc`] || ''} onChange={set(`${key}_desc`)} rows={3} className="form-textarea" />
          </div>
          <div>
            <label className="form-label">{lv.levelFeatures} <span className="text-slate-400 font-normal">(1 {lv.featurePerLine})</span></label>
            <textarea value={fields[`${key}_features`] || ''} onChange={set(`${key}_features`)} rows={4} className="form-textarea font-mono text-sm" placeholder="Éveil sensoriel&#10;Initiation aux langues&#10;..." />
          </div>
        </div>
      ))}
    </form>
  )
}
