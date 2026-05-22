import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ConfirmDialog from '../../components/UI/ConfirmDialog'
import Spinner from '../../components/UI/Spinner'
import { useToast } from '../../components/UI/Toast'
import { useLanguage } from '../../context/LanguageContext'

function fmt(d, lang) { return d ? new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—' }

export default function EventsList() {
  const toast = useToast()
  const { t, lang } = useLanguage()
  const ev = t.events
  const STATUS_MAP = {
    upcoming:  { label: ev.upcoming,  cls: 'badge-blue'  },
    ongoing:   { label: ev.ongoing,   cls: 'badge-green' },
    past:      { label: ev.past,      cls: 'badge-gray'  },
    cancelled: { label: ev.cancelled, cls: 'badge-red'   },
  }
  const [events, setEvents]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [status, setStatus]     = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('events').select('*').order('start_date', { ascending: false })
    if (status) q = q.eq('status', status)
    const { data } = await q
    setEvents(data || [])
    setLoading(false)
  }, [status])

  useEffect(() => { load() }, [load])

  async function handleDelete() {
    setDeleting(true)
    await supabase.from('events').delete().eq('id', deleteId)
    toast(t.common.success, 'success')
    setDeleteId(null)
    setDeleting(false)
    load()
  }

  const filters = [['', t.common.all], ['upcoming', ev.upcoming], ['ongoing', ev.ongoing], ['past', ev.past]]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{ev.title}</h1>
          <p className="text-slate-500 text-sm">{events.length} {ev.title.toLowerCase()}</p>
        </div>
        <Link to="/events/new" className="btn btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          {ev.newEvent}
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map(([v, l]) => (
          <button key={v} onClick={() => setStatus(v)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${status === v ? 'bg-navy-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="text-sm">{ev.noEvents}</p>
            <Link to="/events/new" className="btn btn-primary btn-sm mt-3">{ev.addFirst}</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="px-6 py-3 font-semibold text-slate-600">{ev.eventTitle.replace(' *','')}</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">{ev.startDate.replace(' *','')}</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">{ev.location}</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">{t.posts.status}</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map(e => {
                  const s = STATUS_MAP[e.status] || STATUS_MAP.upcoming
                  return (
                    <tr key={e.id} className="table-row-hover">
                      <td className="px-6 py-3">
                        <p className="font-medium text-slate-800">{e.title}</p>
                        <p className="text-slate-400 text-xs truncate max-w-xs">{e.description?.substring(0,60)}...</p>
                      </td>
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell whitespace-nowrap">{fmt(e.start_date, lang)}</td>
                      <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{e.location || '—'}</td>
                      <td className="px-4 py-3"><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <Link to={`/events/${e.id}/edit`} className="btn btn-ghost btn-icon btn-sm text-slate-500 hover:text-navy-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </Link>
                          <button onClick={() => setDeleteId(e.id)} className="btn btn-ghost btn-icon btn-sm text-slate-400 hover:text-red-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title={ev.deleteTitle} message={ev.deleteMsg} />
    </div>
  )
}
