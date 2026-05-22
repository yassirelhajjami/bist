import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

const levelConfig = [
  { id: 'maternelle', color: 'from-amber-400 to-orange-400',    accent: 'text-amber-600',   badge: 'bg-amber-100 text-amber-700',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { id: 'primaire',   color: 'from-emerald-400 to-teal-500',    accent: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
  { id: 'college',    color: 'from-blue-500 to-navy-600',        accent: 'text-blue-600',    badge: 'bg-blue-100 text-blue-700',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  { id: 'lycee',      color: 'from-crimson-500 to-rose-600',     accent: 'text-crimson-600', badge: 'bg-red-100 text-crimson-700',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
]

export default function Levels() {
  const { t } = useLanguage()
  const l = t.levels
  const [content, setContent] = useState(null)

  useEffect(() => {
    fetch('/api/content/levels')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setContent(d.data) })
      .catch(() => {})
  }, [])

  const c = content || {}
  const subtitle = c.section_subtitle || l.subtitle
  const levelIds = ['maternelle', 'primaire', 'college', 'lycee']
  const apiLevels = levelIds.map((id, i) => ({
    name:        c[`${id}_name`]     || l.items[i]?.name,
    ages:        c[`${id}_ages`]     || l.items[i]?.ages,
    description: c[`${id}_desc`]     || l.items[i]?.description,
    features:    c[`${id}_features`]
      ? c[`${id}_features`].split('\n').filter(Boolean)
      : l.items[i]?.features,
  }))

  return (
    <section id="niveaux" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-14 reveal">
          <span className="badge mb-4">{l.badge}</span>
          <h2 className="section-title mx-auto">
            {l.title} <em className="not-italic text-crimson-600">{l.titleEm}</em>
          </h2>
          <p className="section-subtitle mx-auto text-center mt-4">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {apiLevels.map((level, i) => {
            const cfg = levelConfig[i]
            return (
              <div key={cfg.id} className="reveal card group hover:-translate-y-1 p-0 overflow-hidden" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className={`bg-gradient-to-r ${cfg.color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">{level.ages}</span>
                      <h3 className="font-heading text-3xl font-bold mt-1">{level.name}</h3>
                    </div>
                    <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center">{cfg.icon}</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed mb-5">{level.description}</p>
                  <ul className="space-y-2.5">
                    {(level.features || []).map((f, fi) => (
                      <li key={fi} className="flex items-center gap-3 text-sm">
                        <span className={`w-5 h-5 rounded-full ${cfg.badge} flex items-center justify-center shrink-0`}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="text-gray-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#admissions" className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${cfg.accent} hover:gap-3 transition-all duration-200`}>
                    {l.learnMore}
                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
