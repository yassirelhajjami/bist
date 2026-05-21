import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  const h = t.hero
  const [apiStats, setApiStats] = useState(null)

  useEffect(() => {
    fetch('/api/content/homepage')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.data) setApiStats(data.data) })
      .catch(() => {})
  }, [])

  // Use API values for the editable stats; fall back to i18n defaults
  const stat1Value = apiStats?.stat_levels?.value   || h.stat1Value
  const stat2Value = apiStats?.stat_years?.value    || h.stat2Value
  const stat3Value = apiStats?.stat_students?.value || h.stat3Value

  return (
    <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-crimson-600/10 blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-80 h-80 rounded-full bg-navy-600/20 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-crimson-800/10 blur-2xl" />
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating level badges */}
      <div className="absolute right-8 top-1/4 hidden xl:flex flex-col gap-3 animate-[fadeIn_1s_ease_0.8s_both]">
        {[h.level1 || 'Maternelle', h.level2 || 'Primaire', h.level3 || 'Collège', h.level4 || 'Lycée'].map((level, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white text-sm font-medium">
            {level}
          </div>
        ))}
      </div>

      <div className="container-custom relative z-10 pt-28 pb-20">
        <div className="max-w-3xl">
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 animate-[fadeUp_0.6s_ease_0.3s_both]">
            {h.title1}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-crimson-300 to-crimson-500">
              {h.title2}
            </span>
            <br />{h.title3}
          </h1>

          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl animate-[fadeUp_0.6s_ease_0.4s_both]">
            {h.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 animate-[fadeUp_0.6s_ease_0.5s_both]">
            <a href="#admissions" className="btn-primary text-base px-8 py-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {h.cta1}
            </a>
            <a href="#apropos" className="btn-secondary text-base px-8 py-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {h.cta2}
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-16 pt-12 border-t border-white/10 animate-[fadeUp_0.6s_ease_0.6s_both]">
            {[
              { value: stat1Value, label: h.stat1Label },
              { value: stat2Value, label: h.stat2Label },
              { value: stat3Value, label: h.stat3Label },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-white/50 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-[fadeIn_1s_ease_1s_both]">
        <span className="text-white/40 text-xs tracking-widest uppercase">{h.scroll}</span>
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
