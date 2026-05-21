import { useEffect, useState, useCallback } from 'react'
import api from '../../api/client'
import ConfirmDialog from '../../components/UI/ConfirmDialog'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

function Badge({ type }) {
  const { t } = useLanguage()
  const s = t.submissions
  return type === 'contact'
    ? <span className="badge badge-navy text-xs">{s.typeContact}</span>
    : <span className="badge badge-crimson text-xs">{s.typeRegistration}</span>
}

function SubmissionCard({ item, onMarkRead, onDelete }) {
  const { t } = useLanguage()
  const s = t.submissions
  const [expanded, setExpanded] = useState(false)

  const date = new Date(item.created_at).toLocaleString()

  return (
    <div className={`card p-5 transition-all ${!item.isRead ? 'border-l-4 border-navy-500' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm ${item.type === 'contact' ? 'bg-navy-700' : 'bg-crimson-600'}`}>
            {(item.name || '?')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-slate-800">{item.name || '—'}</p>
              <Badge type={item.type} />
              {!item.isRead && <span className="badge badge-green text-xs">{s.newBadge}</span>}
            </div>
            <p className="text-slate-500 text-sm">{item.email || item.phone || '—'}</p>
            <p className="text-slate-400 text-xs mt-0.5">{s.receivedAt} : {date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setExpanded(x => !x)}
            className="btn btn-ghost btn-sm text-slate-500 hover:text-navy-700"
          >
            <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {!item.isRead && (
            <button onClick={() => onMarkRead(item._id || item.id)} title={s.markRead}
              className="btn btn-ghost btn-icon btn-sm text-slate-400 hover:text-emerald-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          <button onClick={() => onDelete(item._id || item.id)}
            className="btn btn-ghost btn-icon btn-sm text-slate-400 hover:text-red-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-sm">
          {item.subject && (
            <div><span className="font-medium text-slate-600">{s.subject} :</span> <span className="text-slate-700">{item.subject}</span></div>
          )}
          {item.phone && item.type === 'registration' && (
            <div><span className="font-medium text-slate-600">{s.phone} :</span> <span className="text-slate-700">{item.phone}</span></div>
          )}
          {item.level && (
            <div><span className="font-medium text-slate-600">{s.level} :</span> <span className="text-slate-700">{item.level}</span></div>
          )}
          {item.email && (
            <div><span className="font-medium text-slate-600">Email :</span> <a href={`mailto:${item.email}`} className="text-navy-600 underline">{item.email}</a></div>
          )}
          {item.message && (
            <div>
              <p className="font-medium text-slate-600 mb-1">{s.message} :</p>
              <p className="bg-slate-50 rounded-xl p-3 text-slate-700 leading-relaxed whitespace-pre-wrap">{item.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SubmissionsList() {
  const toast = useToast()
  const { t } = useLanguage()
  const s = t.submissions

  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [typeFilter, setType]   = useState('')
  const [readFilter, setRead]   = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (typeFilter) params.set('type', typeFilter)
      if (readFilter !== '') params.set('is_read', readFilter)
      const { data } = await api.get(`/submissions?${params}`)
      setItems(data.data || [])
    } finally { setLoading(false) }
  }, [typeFilter, readFilter])

  useEffect(() => { load() }, [load])

  async function markRead(id) {
    try {
      await api.patch(`/submissions/${id}/read`, { is_read: true })
      setItems(prev => prev.map(i => (i._id || i.id) === id ? { ...i, is_read: true } : i))
    } catch { toast(t.common.error, 'error') }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.delete(`/submissions/${deleteId}`)
      toast(t.common.success, 'success')
      setDeleteId(null)
      load()
    } catch { toast(t.common.error, 'error') }
    finally { setDeleting(false) }
  }

  const unread = items.filter(i => !i.is_read).length

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{s.title}</h1>
          <p className="text-slate-500 text-sm">
            {items.length} {s.title.toLowerCase()}
            {unread > 0 && <span className="ml-2 badge badge-navy">{unread} {s.unread}</span>}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[['', s.all], ['contact', s.contact], ['registration', s.registration]].map(([v, l]) => (
          <button key={v} onClick={() => setType(v)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${typeFilter === v ? 'bg-navy-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {l}
          </button>
        ))}
        <div className="w-px bg-slate-200 mx-1" />
        {[['', s.all], ['false', s.unread], ['true', s.read]].map(([v, l]) => (
          <button key={v} onClick={() => setRead(v)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${readFilter === v ? 'bg-crimson-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
      ) : items.length === 0 ? (
        <div className="card flex flex-col items-center justify-center h-48 text-slate-400">
          <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">{s.noSubmissions}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <SubmissionCard
              key={item._id || item.id}
              item={item}
              onMarkRead={markRead}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={s.deleteTitle}
        message={s.deleteMsg}
      />
    </div>
  )
}
