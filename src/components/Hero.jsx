import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

export default function Hero() {
  const { t } = useLanguage()
  const h = t.hero
  const [content, setContent] = useState({})

  useEffect(() => {
    supabase.from('page_content').select('key, value').eq('page', 'homepage')
      .then(({ data }) => { if (data) setContent(Object.fromEntries(data.map(r => [r.key, r.value]))) })
      .catch(() => {})
  }, [])

  const stat1Value = content.stat_levels   || h.stat1Value
  const stat2Value = content.stat_years    || h.stat2Value
  const stat3Value = content.stat_students || h.stat3Value
  const bgImage    = content.hero_bg_image
  const heroTitle  = content.hero_title
  const heroSub    = content.hero_subtitle

  return (
    <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden">

      {/* Background */}
      {bgImage ? (
        <div className="absolute inset-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-950/72" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-navy-950" />
      )}

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Crimson left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-crimson-600" />

      {/* Giant ghost "BIST" — purely decorative */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:flex items-center overflow-hidden">
        <span
          className="font-black leading-none tracking-tighter"
          style={{
            fontSize: 'clamp(10rem, 18vw, 18rem)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.045)',
          }}
        >
          BIST
        </span>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-32 pb-40">
        <div className="max-w-4xl">

          {/* Location tag */}
          <div className="flex items-center gap-3 mb-8 animate-[fadeUp_0.5s_ease_0.1s_both]">
            <div className="w-10 h-px bg-crimson-500" />
            <span className="text-crimson-400 text-xs font-bold uppercase tracking-[0.3em]">
              Tanger — Maroc
            </span>
          </div>

          {/* Title */}
          {heroTitle ? (
            <h1 className="font-heading text-6xl md:text-7xl xl:text-[5.5rem] text-white leading-[0.9] mb-10 animate-[fadeUp_0.6s_ease_0.2s_both]">
              {heroTitle}
            </h1>
          ) : (
            <h1 className="font-heading text-6xl md:text-7xl xl:text-[5.5rem] text-white leading-[0.9] mb-10 animate-[fadeUp_0.6s_ease_0.2s_both]">
              {h.title1}
              <br />
              <em className="not-italic text-crimson-400">{h.title2}</em>
              <br />
              <span className="text-white/40">{h.title3}</span>
            </h1>
          )}

          <p className="text-base md:text-lg text-white/55 leading-relaxed mb-12 max-w-lg animate-[fadeUp_0.6s_ease_0.3s_both]">
            {heroSub || h.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 animate-[fadeUp_0.6s_ease_0.4s_both]">
            <a href="#admissions" className="btn-primary text-base px-8 py-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {content.hero_cta_primary || h.cta1}
            </a>
            <a href="#apropos" className="btn-secondary text-base px-8 py-4">
              {content.hero_cta_secondary || h.cta2}
            </a>
          </div>

          {/* Stats — editorial horizontal bar */}
          <div className="flex flex-wrap items-stretch gap-0 mt-20 pt-10 border-t border-white/10 animate-[fadeUp_0.6s_ease_0.5s_both]">
            {[
              { value: stat1Value, label: h.stat1Label },
              { value: stat2Value, label: h.stat2Label },
              { value: stat3Value, label: h.stat3Label },
            ].map((stat, i) => (
              <div key={i} className={`pr-10 ${i > 0 ? 'pl-10 border-l border-white/10' : ''} ${i < 2 ? 'mr-0' : ''}`}>
                <p className="font-heading text-5xl font-bold text-white leading-none">{stat.value}</p>
                <p className="text-white/35 text-[10px] uppercase tracking-[0.2em] mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave into the white About section */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-14 md:h-20 block" fill="white">
          <path d="M0,80 L0,55 C200,30 400,10 720,22 C1040,34 1240,58 1440,48 L1440,80 Z" />
        </svg>
      </div>
    </section>
  )
}
