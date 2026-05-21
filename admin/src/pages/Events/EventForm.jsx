import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/client'
import MediaUpload from '../../components/MediaUpload'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

export default function EventForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast    = useToast()
  const { t }    = useLanguage()
  const ev       = t.events
  const isEdit   = Boolean(id)

  const [form, setForm] = useState({
    title: '', description: '', startDate: '', endDate: '', location: '', bannerImage: '',
  })
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    api.get(`/events/${id}`).then(r => {
      const e = r.data.data
      setForm({
        title:       e.title       || '',
        description: e.description || '',
        startDate:   e.startDate   ? e.startDate.slice(0, 16) : '',
        endDate:     e.endDate     ? e.endDate.slice(0, 16)   : '',
        location:    e.location    || '',
        bannerImage: e.bannerImage || '',
      })
    }).finally(() => setFetching(false))
  }, [id, isEdit])

  function set(f) { return e => setForm(prev => ({ ...prev, [f]: e.target ? e.target.value : e })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return toast(t.common.required, 'error')
    if (!form.startDate)    return toast(t.common.required, 'error')
    setLoading(true)
    try {
      if (isEdit) await api.patch(`/events/${id}`, form)
      else await api.post('/events', form)
      toast(t.common.success, 'success')
      navigate('/events')
    } catch (err) {
      toast(err.response?.data?.message || t.common.error, 'error')
    } finally { setLoading(false) }
  }

  if (fetching) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{isEdit ? ev.editEvent : ev.newEvent}</h1>
        </div>
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
            <textarea value={form.description} onChange={set('description')} rows={5} className="form-textarea" required />
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
              <input type="datetime-local" value={form.startDate} onChange={set('startDate')} className="form-input" required />
            </div>
            <div>
              <label className="form-label">{ev.endDate} <span className="text-slate-400 font-normal">(optionnel)</span></label>
              <input type="datetime-local" value={form.endDate} onChange={set('endDate')} className="form-input" min={form.startDate} />
            </div>
          </div>
          <div className="card card-body">
            <MediaUpload
              value={form.bannerImage}
              onChange={url => setForm(f => ({ ...f, bannerImage: url }))}
              subdir="images/events"
              label={ev.banner}
              helpText="JPG, PNG, WebP — max 10MB"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
