import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

const methodIcons = [
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>,
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>,
]

export default function Teaching() {
  const { t } = useLanguage()
  const p = t.pedagogy
  const [content, setContent] = useState(null)

  useEffect(() => {
    fetch('/api/content/teaching')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setContent(d.data) })
      .catch(() => {})
  }, [])

  const c = content || {}
  const p1 = c.p1 || p.p1
  const p2 = c.p2 || p.p2
  const quote = c.quote || p.quote
  const quoteAuthor = c.quote_author || p.quoteAuthor
  const methods = Array.from({ length: 6 }, (_, i) => ({
    title: c[`method_${i + 1}_title`] || p.methods[i]?.title,
    desc:  c[`method_${i + 1}_desc`]  || p.methods[i]?.desc,
  }))

  return (
    <section id="pedagogie" className="section-padding bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-navy-50 to-transparent pointer-events-none" />

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-28 reveal">
            <span className="badge mb-4">{p.badge}</span>
            <h2 className="section-title mb-6">
              {p.title} <em className="not-italic text-crimson-600">{p.titleEm}</em>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">{p1}</p>
            <p className="text-gray-600 leading-relaxed mb-8">{p2}</p>
            <div className="bg-navy-900 rounded-2xl p-6 text-white">
              <svg className="w-8 h-8 text-crimson-400 mb-3" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
              </svg>
              <p className="text-white/80 italic leading-relaxed">"{quote}"</p>
              <p className="text-crimson-400 text-sm font-semibold mt-3">— {quoteAuthor}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {methods.map((m, i) => (
              <div key={i} className="reveal card p-5 group hover:-translate-y-1" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-navy-900 group-hover:bg-crimson-600 rounded-xl flex items-center justify-center text-white shrink-0 transition-colors duration-300">
                    {methodIcons[i]}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-crimson-500 tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="font-heading text-base font-semibold text-navy-900 mt-0.5 mb-2">{m.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
