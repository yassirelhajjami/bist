import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import MediaUpload from '../../components/MediaUpload'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

export default function StaffForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast    = useToast()
  const { t }    = useLanguage()
  const s        = t.staff
  const isEdit   = Boolean(id)

  const [form, setForm] = useState({
    name: '', role: '', bio: '', photo: '', order_index: 0, is_active: true,
  })
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    supabase.from('staff').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setForm({
        name: data.name || '', role: data.role || '',
        bio: data.bio || '', photo: data.photo || '',
        order_index: data.order_index || 0, is_active: data.is_active,
      })
    }).finally(() => setFetching(false))
  }, [id, isEdit])

  function set(f) { return e => setForm(p => ({ ...p, [f]: e.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.role.trim()) return toast(t.common.required, 'error')
    setLoading(true)
    try {
      if (isEdit) {
        const { error } = await supabase.from('staff').update(form).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('staff').insert(form)
        if (error) throw error
      }
      toast(t.common.success, 'success')
      navigate('/staff')
    } catch (err) { toast(err.message || t.common.error, 'error') }
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
              <input value={form.role} onChange={set('role')} className="form-input" required />
            </div>
          </div>
          <div>
            <label className="form-label">{s.bio}</label>
            <textarea value={form.bio} onChange={set('bio')} rows={4} className="form-textarea" />
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
              <input type="number" value={form.order_index} onChange={set('order_index')} className="form-input" min={0} />
              <p className="form-error text-slate-400">{s.orderHint}</p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={set('is_active')} className="w-4 h-4 accent-navy-700" />
              <span className="text-sm font-medium text-slate-700">{s.isActive}</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}
