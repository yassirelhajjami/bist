import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

const methodIcons = [
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>,
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>,
]

export default function Teaching() {
  const { t } = useLanguage()
  const p = t.pedagogy
  const [content, setContent] = useState({})

  useEffect(() => {
    supabase.from('page_content').select('key, value').eq('page', 'teaching')
      .then(({ data }) => { if (data) setContent(Object.fromEntries(data.map(r => [r.key, r.value]))) })
      .catch(() => {})
  }, [])

  const c = content
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

      {/* Watermark */}
      <div className="absolute top-0 left-0 pointer-events-none select-none leading-none overflow-hidden"
        style={{ fontSize: 'clamp(8rem, 14vw, 13rem)', fontWeight: 900, color: 'transparent', WebkitTextStroke: '1px rgba(19,45,121,0.04)', lineHeight: 1 }}>
        03
      </div>

      <div className="container-custom relative">
        {/* Quote — full-width feature */}
        <div className="reveal mb-20">
          <div className="bg-navy-950 rounded-3xl px-10 py-12 md:px-16 md:py-14 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-crimson-600" />
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-crimson-500" />
                <span className="text-crimson-400 text-xs font-bold uppercase tracking-[0.25em]">{p.badge}</span>
              </div>
              <p className="font-heading text-2xl md:text-3xl text-white leading-relaxed mb-6 italic">
                &ldquo;{quote}&rdquo;
              </p>
              <p className="text-crimson-400 text-sm font-bold tracking-widest uppercase">— {quoteAuthor}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left sticky */}
          <div className="lg:sticky lg:top-28 reveal">
            <span className="badge mb-6">{p.badge}</span>
            <h2 className="section-title mb-6">
              {p.title} <em className="not-italic text-crimson-600">{p.titleEm}</em>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-base">{p1}</p>
            <p className="text-gray-500 leading-relaxed text-sm">{p2}</p>
          </div>

          {/* Right — method cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {methods.map((m, i) => (
              <div key={i} className="reveal group border border-gray-100 rounded-2xl p-5 hover:border-navy-200 hover:shadow-card transition-all duration-300" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-navy-950 group-hover:bg-crimson-600 rounded-xl flex items-center justify-center text-white shrink-0 transition-colors duration-300">
                    {methodIcons[i]}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-crimson-400 tracking-[0.2em] uppercase">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="font-heading text-sm font-semibold text-navy-900 mt-0.5 mb-1.5">{m.title}</h3>
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
