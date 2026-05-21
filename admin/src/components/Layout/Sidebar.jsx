import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'

function navIcons() {
  return {
    dashboard: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    news: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    gallery: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    events: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    staff: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    homepage: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    admissions: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    submissions: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    settings: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    logout: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
  }
}

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const { t, lang, setLang } = useLanguage()
  const location = useLocation()
  const icons = navIcons()

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to)

  const navItems = [
    { label: t.nav.dashboard, to: '/', exact: true, icon: icons.dashboard },
    { type: 'separator', label: t.nav.content },
    { label: t.nav.news,     to: '/posts',   icon: icons.news },
    { label: t.nav.gallery,  to: '/gallery', icon: icons.gallery },
    { label: t.nav.events,   to: '/events',  icon: icons.events },
    { label: t.nav.staff,    to: '/staff',   icon: icons.staff },
    { type: 'separator', label: t.nav.website },
    { label: t.nav.homepage,   to: '/homepage',   icon: icons.homepage },
    { label: t.nav.admissions, to: '/admissions', icon: icons.admissions },
    { type: 'separator', label: t.nav.system },
    { label: t.nav.submissions, to: '/submissions', icon: icons.submissions },
    { label: t.nav.settings,   to: '/settings',    icon: icons.settings },
  ]

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-navy-950 z-30 flex flex-col
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-navy-800 flex items-center gap-3">
          <img src="/badrane.png" alt="Badrane" className="h-9 w-auto brightness-0 invert" />
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold leading-tight truncate">Badrane International</p>
            <p className="text-crimson-400 text-xs truncate">
              {lang === 'ar' ? 'الإدارة' : 'Administration'}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map((item, i) => {
            if (item.type === 'separator') {
              return (
                <p key={i} className="text-navy-500 text-xs font-semibold uppercase tracking-widest px-3 pt-5 pb-2">
                  {item.label}
                </p>
              )
            }
            const active = isActive(item.to, item.exact)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`sidebar-link ${active ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-navy-800">
          {/* Language toggle */}
          <div className="flex items-center justify-between px-3 py-2 mb-2">
            <span className="text-navy-400 text-xs">
              {lang === 'ar' ? 'اللغة' : 'Langue'}
            </span>
            <button
              onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
              className="flex items-center gap-1.5 bg-navy-800 hover:bg-navy-700 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
            >
              <span>{lang === 'fr' ? '🇲🇦 عربي' : '🇫🇷 Français'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-crimson-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-navy-400 text-xs truncate">
                {user?.role === 'admin' ? t.nav.admin : t.nav.editor}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="sidebar-link sidebar-link-inactive w-full text-red-400 hover:bg-red-900/30 hover:text-red-300"
          >
            {icons.logout}
            {t.nav.logout}
          </button>
        </div>
      </aside>
    </>
  )
}
