import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import MediaUpload from '../../components/MediaUpload'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

export default function SettingsPage() {
  const toast = useToast()
  const { t } = useLanguage()
  const s = t.settings

  const TAB_LIST = [
    { id: 'general', label: s.general  },
    { id: 'contact', label: s.contact  },
    { id: 'social',  label: s.social   },
    { id: 'account', label: s.account  },
  ]

  const [tab, setTab]           = useState('general')
  const [settings, setSettings] = useState(null)
  const [settingsId, setSettingsId] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [pw, setPw]             = useState({ newPw: '', confirm: '' })
  const [savingPw, setSavingPw] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('*').limit(1).single()
      .then(({ data }) => {
        if (data) { setSettingsId(data.id); setSettings(data) }
      })
      .finally(() => setLoading(false))
  }, [])

  function setField(path, value) {
    setSettings(prev => {
      const next = { ...prev }
      const keys = path.split('.')
      let cur = next
      keys.slice(0, -1).forEach(k => { cur[k] = { ...cur[k] }; cur = cur[k] })
      cur[keys[keys.length - 1]] = value
      return next
    })
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (settingsId) {
        const { error } = await supabase.from('settings').update(settings).eq('id', settingsId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('settings').insert(settings).select().single()
        if (error) throw error
        setSettingsId(data.id)
      }
      toast(t.common.success, 'success')
    } catch { toast(t.common.error, 'error') }
    finally { setSaving(false) }
  }

  async function changePassword(e) {
    e.preventDefault()
    if (pw.newPw !== pw.confirm) return toast('Mots de passe différents', 'error')
    if (pw.newPw.length < 6) return toast('Minimum 6 caractères', 'error')
    setSavingPw(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: pw.newPw })
      if (error) throw error
      toast(t.common.success, 'success')
      setPw({ newPw: '', confirm: '' })
    } catch (err) { toast(err.message || t.common.error, 'error') }
    finally { setSavingPw(false) }
  }

  if (loading || !settings) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  const SaveBtn = ({ disabled }) => (
    <div className="flex justify-end pt-2 border-t border-slate-100">
      <button type="submit" className="btn btn-primary" disabled={disabled}>
        {disabled ? <Spinner size="sm" color="white" /> : t.common.save}
      </button>
    </div>
  )

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{s.title}</h1>
        <p className="text-slate-500 text-sm mt-0.5">{s.subtitle}</p>
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
        {TAB_LIST.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === tb.id ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
            {tb.label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <form onSubmit={save} className="card card-body space-y-5">
          <h2 className="font-semibold text-slate-800 border-b pb-3">{s.generalInfo}</h2>
          <div>
            <label className="form-label">{s.schoolName}</label>
            <input value={settings.school_name || ''} onChange={e => setField('school_name', e.target.value)} className="form-input" />
          </div>
          <MediaUpload value={settings.logo || ''} onChange={url => setField('logo', url)} subdir="images/branding" label={s.logo} helpText={s.logoHint} />
          <SaveBtn disabled={saving} />
        </form>
      )}

      {tab === 'contact' && (
        <form onSubmit={save} className="card card-body space-y-4">
          <h2 className="font-semibold text-slate-800 border-b pb-3">{s.contactInfo}</h2>
          <div>
            <label className="form-label">{s.address}</label>
            <input value={settings.contact?.address || ''} onChange={e => setField('contact.address', e.target.value)} className="form-input" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{s.phone}</label>
              <input value={settings.contact?.phone || ''} onChange={e => setField('contact.phone', e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="form-label">{s.email}</label>
              <input type="email" value={settings.contact?.email || ''} onChange={e => setField('contact.email', e.target.value)} className="form-input" />
            </div>
          </div>
          <div>
            <label className="form-label">{s.mapUrl}</label>
            <input value={settings.contact?.mapUrl || ''} onChange={e => setField('contact.mapUrl', e.target.value)} className="form-input" />
          </div>
          <SaveBtn disabled={saving} />
        </form>
      )}

      {tab === 'social' && (
        <form onSubmit={save} className="card card-body space-y-4">
          <h2 className="font-semibold text-slate-800 border-b pb-3">{s.social}</h2>
          {[
            { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/...' },
            { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
            { key: 'youtube',   label: 'YouTube',   placeholder: 'https://youtube.com/...' },
            { key: 'twitter',   label: 'Twitter/X', placeholder: 'https://twitter.com/...' },
          ].map(sn => (
            <div key={sn.key}>
              <label className="form-label">{sn.label}</label>
              <input value={settings.social_media?.[sn.key] || ''} onChange={e => setField(`social_media.${sn.key}`, e.target.value)} className="form-input" placeholder={sn.placeholder} />
            </div>
          ))}
          <SaveBtn disabled={saving} />
        </form>
      )}

      {tab === 'account' && (
        <form onSubmit={changePassword} className="card card-body space-y-4">
          <h2 className="font-semibold text-slate-800 border-b pb-3">{s.changePassword}</h2>
          <div>
            <label className="form-label">{s.newPassword}</label>
            <input type="password" value={pw.newPw} onChange={e => setPw(p => ({ ...p, newPw: e.target.value }))} className="form-input" minLength={6} required />
          </div>
          <div>
            <label className="form-label">{s.confirmPassword}</label>
            <input type="password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} className="form-input" required />
          </div>
          <SaveBtn disabled={savingPw} />
        </form>
      )}
    </div>
  )
}
