import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

const levelConfig = [
  { id: 'maternelle', color: 'bg-amber-500',   light: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200',
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { id: 'primaire',   color: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200',
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
  { id: 'college',    color: 'bg-blue-600',    light: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  { id: 'lycee',      color: 'bg-crimson-600', light: 'bg-red-50',     text: 'text-crimson-600', border: 'border-red-200',
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
]

export default function Levels() {
  const { t } = useLanguage()
  const l = t.levels
  const [content, setContent] = useState({})

  useEffect(() => {
    supabase.from('page_content').select('key, value').eq('page', 'levels')
      .then(({ data }) => { if (data) setContent(Object.fromEntries(data.map(r => [r.key, r.value]))) })
      .catch(() => {})
  }, [])

  const c = content
  const subtitle = c.section_subtitle || l.subtitle
  const levels = levelConfig.map(({ id }, i) => ({
    name:        c[`${id}_name`]     || l.items[i]?.name,
    ages:        c[`${id}_ages`]     || l.items[i]?.ages,
    description: c[`${id}_desc`]    || l.items[i]?.description,
    features:    c[`${id}_features`]
      ? c[`${id}_features`].split('\n').filter(Boolean)
      : l.items[i]?.features,
  }))

  return (
    <section id="niveaux" className="section-padding bg-gray-50 relative overflow-hidden">

      {/* Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none select-none leading-none overflow-hidden"
        style={{ fontSize: 'clamp(8rem, 14vw, 13rem)', fontWeight: 900, color: 'transparent', WebkitTextStroke: '1px rgba(19,45,121,0.05)', lineHeight: 1 }}>
        02
      </div>

      <div className="container-custom relative">
        <div className="mb-16 reveal">
          <span className="badge mb-6">{l.badge}</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="section-title">
              {l.title} <em className="not-italic text-crimson-600">{l.titleEm}</em>
            </h2>
            <p className="text-gray-500 max-w-md text-sm leading-relaxed">{subtitle}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {levels.map((level, i) => {
            const cfg = levelConfig[i]
            return (
              <div key={cfg.id} className="reveal group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-card-hover transition-all duration-300" style={{ transitionDelay: `${i * 0.08}s` }}>
                {/* Header */}
                <div className="p-6 flex items-center gap-5">
                  <div className={`w-14 h-14 ${cfg.light} ${cfg.border} border rounded-2xl flex items-center justify-center ${cfg.text} shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading text-xl text-navy-900">{level.name}</h3>
                      <span className={`text-xs font-bold ${cfg.text} ${cfg.light} px-2.5 py-1 rounded-full shrink-0`}>{level.ages}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1.5 leading-relaxed line-clamp-2">{level.description}</p>
                  </div>
                </div>

                {/* Features */}
                <div className={`border-t ${cfg.border} bg-gradient-to-br from-white to-gray-50 px-6 py-4`}>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {(level.features || []).map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-xs text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full ${cfg.color} shrink-0`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#admissions" className={`mt-4 inline-flex items-center gap-1.5 text-xs font-bold ${cfg.text} hover:gap-3 transition-all duration-200 uppercase tracking-wide`}>
                    {l.learnMore}
                    <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
