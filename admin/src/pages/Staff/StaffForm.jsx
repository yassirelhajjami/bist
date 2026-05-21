import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/client'
import MediaUpload from '../../components/MediaUpload'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

const DEPTS = ['Direction', 'Maternelle', 'Primaire', 'Collège', 'Lycée', 'Administration', 'Parascolaire']

export default function StaffForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast    = useToast()
  const { t }    = useLanguage()
  const s        = t.staff
  const isEdit   = Boolean(id)

  const [form, setForm] = useState({
    name: '', position: '', department: 'Administration', bio: '',
    photo: '', email: '', phone: '', order: 0, isActive: true,
  })
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    api.get(`/staff/${id}`).then(r => {
      const m = r.data.data
      setForm({
        name: m.name||'', position: m.position||'', department: m.department||'Administration',
        bio: m.bio||'', photo: m.photo||'', email: m.email||'', phone: m.phone||'',
        order: m.order||0, isActive: m.isActive,
      })
    }).finally(() => setFetching(false))
  }, [id, isEdit])

  function set(f) { return e => setForm(p => ({ ...p, [f]: e.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.position.trim()) return toast(t.common.required, 'error')
    setLoading(true)
    try {
      if (isEdit) await api.patch(`/staff/${id}`, form)
      else await api.post('/staff', form)
      toast(t.common.success, 'success')
      navigate('/staff')
    } catch (err) { toast(err.response?.data?.message || t.common.error, 'error') }
    finally { setLoading(false) }
  }

  if (fetching) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{isEdit ? s.editMember : s.addMember}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{s.profileDesc}</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button type="button" onClick={() => navigate('/staff')} className="btn btn-outline">{t.common.cancel}</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Spinner size="sm" color="white" /> : (isEdit ? t.common.update : t.common.add)}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card card-body space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{s.fullName}</label>
              <input value={form.name} onChange={set('name')} className="form-input" required />
            </div>
            <div>
              <label className="form-label">{s.position}</label>
              <input value={form.position} onChange={set('position')} className="form-input" required />
            </div>
          </div>
          <div>
            <label className="form-label">{s.department}</label>
            <select value={form.department} onChange={set('department')} className="form-select">
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">{s.bio}</label>
            <textarea value={form.bio} onChange={set('bio')} rows={4} className="form-textarea" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{s.email}</label>
              <input type="email" value={form.email} onChange={set('email')} className="form-input" />
            </div>
            <div>
              <label className="form-label">{s.phone}</label>
              <input value={form.phone} onChange={set('phone')} className="form-input" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card card-body">
            <MediaUpload
              value={form.photo}
              onChange={url => setForm(f => ({ ...f, photo: url }))}
              subdir="images/staff"
              label={s.photo}
              helpText={s.photoHint}
            />
          </div>
          <div className="card card-body space-y-3">
            <div>
              <label className="form-label">{s.order}</label>
              <input type="number" value={form.order} onChange={set('order')} className="form-input" min={0} />
              <p className="form-error text-slate-400">{s.orderHint}</p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={set('isActive')} className="w-4 h-4 accent-navy-700" />
              <span className="text-sm font-medium text-slate-700">{s.isActive}</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}
