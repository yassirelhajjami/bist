import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'

export default function TopBar({ onMenuToggle }) {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const { t } = useLanguage()
  const n = t.nav

  const breadcrumbs = {
    '/':           [{ label: n.dashboard }],
    '/posts':      [{ label: n.news, to: '/posts' }],
    '/posts/new':  [{ label: n.news, to: '/posts' }, { label: t.posts.newPost }],
    '/gallery':    [{ label: n.gallery }],
    '/events':     [{ label: n.events, to: '/events' }],
    '/events/new': [{ label: n.events, to: '/events' }, { label: t.events.newEvent }],
    '/homepage':   [{ label: n.homepage }],
    '/admissions': [{ label: n.admissions }],
    '/staff':      [{ label: n.staff, to: '/staff' }],
    '/staff/new':  [{ label: n.staff, to: '/staff' }, { label: t.staff.addMember }],
    '/settings':   [{ label: n.settings }],
  }

  const editMatch = pathname.match(/\/(posts|events|staff)\/(.+)\/edit/)
  let crumbs = breadcrumbs[pathname]
  if (!crumbs && editMatch) {
    const sectionLabel = { posts: n.news, events: n.events, staff: n.staff }[editMatch[1]]
    const editLabel = { posts: t.posts.editPost, events: t.events.editEvent, staff: t.staff.editMember }[editMatch[1]]
    crumbs = [{ label: sectionLabel, to: `/${editMatch[1]}` }, { label: editLabel }]
  }
  crumbs = crumbs || [{ label: 'Page' }]

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-4 sticky top-0 z-10">
      <button
        onClick={onMenuToggle}
        className="lg:hidden btn-ghost btn-icon text-slate-500"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Breadcrumbs */}
      <nav className="flex-1 flex items-center gap-1.5 text-sm min-w-0">
        <Link to="/" className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5 min-w-0">
            <svg className="w-3 h-3 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {c.to ? (
              <Link to={c.to} className="text-slate-500 hover:text-slate-700 transition-colors truncate">{c.label}</Link>
            ) : (
              <span className="text-slate-800 font-medium truncate">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-sm hidden sm:inline-flex"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {t.topbar.viewSite}
        </a>
        <div className="w-8 h-8 bg-navy-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {user?.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  )
}
