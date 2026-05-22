import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import MediaUpload from '../../components/MediaUpload'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

const STATUS_OPTIONS = ['upcoming', 'ongoing', 'past', 'cancelled']

export default function EventForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast    = useToast()
  const { t }    = useLanguage()
  const ev       = t.events
  const isEdit   = Boolean(id)

  const [form, setForm] = useState({ title: '', description: '', start_date: '', end_date: '', location: '', status: 'upcoming', cover_image: '' })
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    supabase.from('events').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setForm({
        title: data.title || '', description: data.description || '',
        start_date: data.start_date ? data.start_date.slice(0, 16) : '',
        end_date: data.end_date ? data.end_date.slice(0, 16) : '',
        location: data.location || '', status: data.status || 'upcoming',
        cover_image: data.cover_image || '',
      })
    }).finally(() => setFetching(false))
  }, [id, isEdit])

  function set(f) { return e => setForm(prev => ({ ...prev, [f]: e.target ? e.target.value : e })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.start_date) return toast(t.common.required, 'error')
    setLoading(true)
    try {
      if (isEdit) {
        const { error } = await supabase.from('events').update({ ...form, updated_at: new Date().toISOString() }).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('events').insert(form)
        if (error) throw error
      }
      toast(t.common.success, 'success')
      navigate('/events')
    } catch (err) {
      toast(err.message || t.common.error, 'error')
    } finally { setLoading(false) }
  }

  if (fetching) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{isEdit ? ev.editEvent : ev.newEvent}</h1>
        <div className="flex gap-3 shrink-0">
          <button type="button" onClick={() => navigate('/events')} className="btn btn-outline">{t.common.cancel}</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Spinner size="sm" color="white" /> : (isEdit ? t.common.update : ev.addEvent)}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 card card-body">
          <div>
            <label className="form-label">{ev.eventTitle}</label>
            <input value={form.title} onChange={set('title')} className="form-input" required />
          </div>
          <div>
            <label className="form-label">{ev.description}</label>
            <textarea value={form.description} onChange={set('description')} rows={5} className="form-textarea" />
          </div>
          <div>
            <label className="form-label">{ev.location}</label>
            <input value={form.location} onChange={set('location')} className="form-input" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="card card-body space-y-4">
            <div>
              <label className="form-label">{ev.startDate}</label>
              <input type="datetime-local" value={form.start_date} onChange={set('start_date')} className="form-input" required />
            </div>
            <div>
              <label className="form-label">{ev.endDate} <span className="text-slate-400 font-normal">(optionnel)</span></label>
              <input type="datetime-local" value={form.end_date} onChange={set('end_date')} className="form-input" min={form.start_date} />
            </div>
            <div>
              <label className="form-label">{t.posts.status}</label>
              <select value={form.status} onChange={set('status')} className="form-select">
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{t.events[s] || s}</option>)}
              </select>
            </div>
          </div>
          <div className="card card-body">
            <MediaUpload value={form.cover_image} onChange={url => setForm(f => ({ ...f, cover_image: url }))} subdir="images/events" label={ev.banner} helpText="JPG, PNG, WebP — max 10MB" />
          </div>
        </div>
      </div>
    </form>
  )
}
