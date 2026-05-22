import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../components/UI/StatCard'
import Spinner from '../components/UI/Spinner'
import api from '../api/client'
import { useLanguage } from '../context/LanguageContext'

function fmt(date, lang) {
  return new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Dashboard() {
  const { t, lang } = useLanguage()
  const d = t.dashboard
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/stats')
      .then(r => setStats(r.data.data))
      .catch(() => setStats({ counts: {}, recentPosts: [], recentEvents: [] }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  const { counts = {}, recentPosts = [], recentEvents = [] } = stats || {}

  const cards = [
    {
      label: d.totalNews, value: counts?.posts,
      sub: `${counts?.published ?? 0} ${d.published} · ${counts?.drafts ?? 0} ${d.drafts}`,
      color: 'navy', to: '/posts',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
    },
    {
      label: d.gallery, value: counts?.gallery,
      sub: d.photosUploaded,
      color: 'blue', to: '/gallery',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    },
    {
      label: d.events, value: counts?.events,
      sub: `${counts?.upcoming ?? 0} ${d.upcoming}`,
      color: 'emerald', to: '/events',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    },
    {
      label: d.staff, value: counts?.staff,
      sub: d.activeMembers,
      color: 'amber', to: '/staff',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
    {
      label: d.submissionsLabel, value: counts?.submissions,
      sub: counts?.unreadSubmissions > 0 ? `${counts.unreadSubmissions} ${d.unreadLabel}` : d.allReadLabel,
      color: counts?.unreadSubmissions > 0 ? 'crimson' : 'gray', to: '/submissions',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    },
  ]

  const statusClasses = { published: 'badge-green', draft: 'badge-gray' }
  const statusLabels  = { published: t.common.published, draft: t.common.draft }
  const eventStatus   = { upcoming: 'badge-blue', ongoing: 'badge-green', past: 'badge-gray', cancelled: 'badge-red' }
  const eventLabels   = { upcoming: t.events.upcoming, ongoing: t.events.ongoing, past: t.events.past, cancelled: t.events.cancelled }

  const quickActions = [
    { label: d.addPost,      to: '/posts/new',    cls: 'bg-navy-900 hover:bg-navy-800 text-white' },
    { label: d.uploadImages, to: '/gallery',      cls: 'bg-blue-600 hover:bg-blue-700 text-white' },
    { label: d.createEvent,  to: '/events/new',   cls: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
    { label: d.editSite,     to: '/homepage',     cls: 'bg-crimson-600 hover:bg-crimson-700 text-white' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{d.title}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{d.subtitle}</p>
        </div>
        <Link to="/posts/new" className="btn btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          {d.newPost}
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map(c => (
          <Link key={c.label} to={c.to} className="block hover:-translate-y-0.5 transition-transform">
            <StatCard label={c.label} value={c.value} icon={c.icon} color={c.color} sub={c.sub} />
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map(a => (
          <Link key={a.label} to={a.to} className={`${a.cls} rounded-xl px-4 py-3 text-sm font-semibold text-center transition-colors`}>
            {a.label}
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">{d.recentNews}</h2>
            <Link to="/posts" className="text-sm text-navy-600 hover:text-navy-800 font-medium">{d.viewAll}</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentPosts?.length ? recentPosts.map(p => (
              <div key={p._id} className="px-6 py-3 flex items-center justify-between gap-3 hover:bg-slate-50">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                  <p className="text-xs text-slate-400">{fmt(p.createdAt, lang)}</p>
                </div>
                <span className={`badge ${statusClasses[p.status] || 'badge-gray'}`}>{statusLabels[p.status] || p.status}</span>
              </div>
            )) : <p className="px-6 py-8 text-slate-400 text-sm text-center">{d.noNews}</p>}
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">{d.upcomingEvents}</h2>
            <Link to="/events" className="text-sm text-navy-600 hover:text-navy-800 font-medium">{d.viewAll}</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentEvents?.length ? recentEvents.map(ev => (
              <div key={ev._id} className="px-6 py-3 flex items-center justify-between gap-3 hover:bg-slate-50">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{ev.title}</p>
                  <p className="text-xs text-slate-400">{fmt(ev.startDate, lang)}</p>
                </div>
                <span className={`badge ${eventStatus[ev.status] || 'badge-gray'}`}>{eventLabels[ev.status] || ev.status}</span>
              </div>
            )) : <p className="px-6 py-8 text-slate-400 text-sm text-center">{d.noEvents}</p>}
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">{d.recentSubmissions}</h2>
            <Link to="/submissions" className="text-sm text-navy-600 hover:text-navy-800 font-medium">{d.viewAll}</Link>
          </div>
          {counts?.unreadSubmissions > 0 ? (
            <div className="px-6 py-4 bg-crimson-50 border-b border-crimson-100">
              <p className="text-crimson-700 text-sm font-medium">{counts.unreadSubmissions} {d.newSubmissions}</p>
            </div>
          ) : null}
          <div className="px-6 py-8 flex flex-col items-center justify-center text-center gap-2">
            <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <p className="text-sm text-slate-500">{counts?.submissions > 0 ? `${counts.submissions} ${d.totalSubmissions}` : d.noSubmissions}</p>
            <Link to="/submissions" className="btn btn-outline btn-sm mt-1">{d.viewSubmissions}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
