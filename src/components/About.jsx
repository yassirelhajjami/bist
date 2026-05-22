import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

const icons = [
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
]

export default function About() {
  const { t } = useLanguage()
  const a = t.about
  const [content, setContent] = useState(null)

  useEffect(() => {
    fetch('/api/content/about')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setContent(d.data) })
      .catch(() => {})
  }, [])

  const c = content || {}
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
    <section id="apropos" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <div className="reveal">
            <span className="badge mb-4">{a.badge}</span>
            <h2 className="section-title mb-6">
              {a.title} <em className="not-italic text-crimson-600">{a.titleEm}</em> {a.titleEnd}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">{p1}</p>
            <p className="text-gray-600 leading-relaxed mb-8">{p2}</p>
            <a href="#niveaux" className="btn-outline">
              {a.cta}
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div className="reveal relative">
            <div className="relative bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-8 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-crimson-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-navy-600/20 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-crimson-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl mb-3">{missionTitle}</h3>
                <p className="text-white/70 leading-relaxed mb-6">{missionText}</p>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  <div>
                    <p className="font-heading text-3xl font-bold text-crimson-400">100%</p>
                    <p className="text-white/50 text-sm">{a.stat1}</p>
                  </div>
                  <div>
                    <p className="font-heading text-3xl font-bold text-crimson-400">3</p>
                    <p className="text-white/50 text-sm">{a.stat2}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-crimson-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-crimson-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-navy-900 text-sm">{a.excellenceLabel}</p>
                <p className="text-gray-500 text-xs">{a.recognizedLabel}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={i} className="reveal card p-6 group hover:-translate-y-1" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 bg-navy-50 group-hover:bg-navy-900 rounded-2xl flex items-center justify-center mb-4 text-navy-700 group-hover:text-white transition-all duration-300">
                {icons[i]}
              </div>
              <h3 className="font-heading text-lg text-navy-900 mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
