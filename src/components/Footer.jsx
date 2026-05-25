import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

const socialIcons = {
  facebook:  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>,
  instagram: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>,
  youtube:   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
}

export default function Footer() {
  const { t } = useLanguage()
  const f = t.footer
  const year = new Date().getFullYear()
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    supabase.from('settings').select('contact,social_media').limit(1).single()
      .then(({ data }) => { if (data) setSettings(data) })
      .catch(() => {})
  }, [])

  const navLinks = [
    { label: t.nav.home,       href: '#accueil' },
    { label: t.nav.about,      href: '#apropos' },
    { label: t.nav.levels,     href: '#niveaux' },
    { label: t.nav.pedagogy,   href: '#pedagogie' },
    { label: t.nav.admissions, href: '#admissions' },
    { label: t.nav.news,       href: '#actualites' },
    { label: t.nav.contact,    href: '#contact' },
  ]

  const socials = [
    { key: 'facebook',  label: 'Facebook',  fallback: 'https://www.facebook.com' },
    { key: 'instagram', label: 'Instagram', fallback: 'https://www.instagram.com' },
    { key: 'youtube',   label: 'YouTube',   fallback: 'https://www.youtube.com' },
  ]

  return (
    <footer className="bg-navy-950 text-white">
      {/* Top crimson bar */}
      <div className="h-px bg-gradient-to-r from-crimson-600/0 via-crimson-600 to-crimson-600/0" />

      <div className="container-custom pt-16 pb-12">
        {/* Large school name header */}
        <div className="mb-14 pb-12 border-b border-navy-800">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-4 group">
            <img src="/icon.webp" alt="Badrane International School" className="h-14 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
            <div>
              <p className="font-heading text-2xl text-white leading-tight">Badrane International School</p>
              <p className="text-crimson-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Tanger — Maroc</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Description + socials */}
          <div>
            <p className="text-navy-300 text-sm leading-relaxed mb-8">{f.desc}</p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a key={s.key}
                  href={settings?.social_media?.[s.key] || s.fallback}
                  target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-navy-700 hover:border-crimson-600 hover:bg-crimson-600 flex items-center justify-center text-navy-400 hover:text-white transition-all duration-300">
                  {socialIcons[s.key]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-navy-500 mb-5">{f.quickLinks}</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-navy-300 hover:text-crimson-400 transition-colors text-sm flex items-center gap-2.5 group">
                    <span className="w-4 h-px bg-navy-700 group-hover:bg-crimson-600 group-hover:w-6 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-navy-500 mb-5">{f.contactTitle}</h4>
            <ul className="space-y-4 text-sm text-navy-300">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-crimson-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{settings?.contact?.address || 'Tanger, Maroc'}</span>
              </li>
              {settings?.contact?.phone && (
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-crimson-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${settings.contact.phone}`} className="hover:text-crimson-400 transition-colors">{settings.contact.phone}</a>
                </li>
              )}
              {settings?.contact?.email && (
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-crimson-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${settings.contact.email}`} className="hover:text-crimson-400 transition-colors">{settings.contact.email}</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800">
        <div className="container-custom py-5 flex items-center justify-between gap-4 text-xs text-navy-500">
          <p>© {year} Badrane International School — {f.rights}</p>
          <div className="w-8 h-px bg-crimson-600" />
        </div>
      </div>
    </footer>
  )
}
