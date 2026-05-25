import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

export default function About() {
  const { t } = useLanguage()
  const a = t.about
  const [content, setContent] = useState({})

  useEffect(() => {
    supabase.from('page_content').select('key, value').eq('page', 'about')
      .then(({ data }) => { if (data) setContent(Object.fromEntries(data.map(r => [r.key, r.value]))) })
      .catch(() => {})
  }, [])

  const c = content
  const p1 = c.p1 || a.p1
  const p2 = c.p2 || a.p2
  const missionTitle = c.mission_title || a.missionTitle
  const missionText  = c.mission_text  || a.missionText
  const values = [
    { title: c.value_1_title || a.values[0]?.title, desc: c.value_1_desc || a.values[0]?.desc },
    { title: c.value_2_title || a.values[1]?.title, desc: c.value_2_desc || a.values[1]?.desc },
    { title: c.value_3_title || a.values[2]?.title, desc: c.value_3_desc || a.values[2]?.desc },
    { title: c.value_4_title || a.values[3]?.title, desc: c.value_4_desc || a.values[3]?.desc },
  ]

  return (
    <section id="apropos" className="section-padding bg-white relative overflow-hidden">

      {/* Watermark number */}
      <div className="absolute top-0 right-0 pointer-events-none select-none leading-none overflow-hidden"
        style={{ fontSize: 'clamp(8rem, 14vw, 13rem)', fontWeight: 900, color: 'transparent', WebkitTextStroke: '1px rgba(19,45,121,0.05)', lineHeight: 1 }}>
        01
      </div>

      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">

          {/* Left — text */}
          <div className="reveal">
            <span className="badge mb-6">{a.badge}</span>
            <h2 className="section-title mb-8">
              {a.title} <em className="not-italic text-crimson-600">{a.titleEm}</em> {a.titleEnd}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5 text-base">{p1}</p>
            <p className="text-gray-600 leading-relaxed mb-10 text-base">{p2}</p>
            <a href="#niveaux" className="btn-outline">
              {a.cta}
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Right — mission card */}
          <div className="reveal">
            <div className="relative bg-navy-950 rounded-3xl p-10 text-white overflow-hidden">
              {/* Crimson corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-crimson-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-navy-800 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-crimson-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl">{missionTitle}</h3>
                </div>

                <p className="text-white/65 leading-relaxed text-sm mb-10">{missionText}</p>

                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                  <div>
                    <p className="font-heading text-4xl font-bold text-crimson-400 leading-none">100%</p>
                    <p className="text-white/40 text-xs uppercase tracking-widest mt-2">{a.stat1}</p>
                  </div>
                  <div>
                    <p className="font-heading text-4xl font-bold text-crimson-400 leading-none">3</p>
                    <p className="text-white/40 text-xs uppercase tracking-widest mt-2">{a.stat2}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="flex items-center gap-3 mt-4 ml-4">
              <div className="w-2 h-2 rounded-full bg-crimson-600" />
              <p className="text-xs font-semibold text-navy-700">{a.excellenceLabel}</p>
              <span className="text-gray-300">·</span>
              <p className="text-xs text-gray-400">{a.recognizedLabel}</p>
            </div>
          </div>
        </div>

        {/* Values — numbered editorial cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <div
              key={i}
              className="reveal group p-6 border border-gray-100 rounded-2xl hover:border-crimson-200 hover:shadow-card transition-all duration-300"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className="block font-heading text-6xl font-bold leading-none mb-5 text-navy-50 group-hover:text-crimson-50 transition-colors duration-300 select-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-base text-navy-900 mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
