import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const contactIcons = [
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
]

export default function Contact() {
  const { t } = useLanguage()
  const c = t.contact
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: form.nom,
          email: form.email,
          subject: form.sujet,
          message: form.message,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError(c.submitError || 'Erreur lors de l\'envoi. Réessayez.')
    } finally {
      setSubmitting(false)
    }
  }

  const contactInfo = [
    { label: c.labelAddress, value: c.addressValue, link: null },
    { label: c.labelPhone,   value: c.phoneValue,   link: `tel:+212000000000` },
    { label: c.labelEmail,   value: c.emailValue,   link: `mailto:${c.emailValue}` },
    { label: c.labelHours,   value: c.hoursValue,   link: null },
  ]

  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-14 reveal">
          <span className="badge mb-4">{c.badge}</span>
          <h2 className="section-title mx-auto">
            {c.title} <em className="not-italic text-crimson-600">{c.titleEm}</em>
          </h2>
          <p className="section-subtitle mx-auto text-center">{c.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="reveal card p-6">
              <h3 className="font-heading text-lg text-navy-900 mb-5">{c.infoTitle}</h3>
              <ul className="space-y-5">
                {contactInfo.map((info, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center text-navy-700 shrink-0">{contactIcons[i]}</div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{info.label}</p>
                      {info.link ? (
                        <a href={info.link} className="text-navy-900 font-medium text-sm hover:text-crimson-600 transition-colors">{info.value}</a>
                      ) : (
                        <p className="text-navy-900 font-medium text-sm">{info.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal card overflow-hidden">
              <div className="h-52 bg-gradient-to-br from-navy-100 to-blue-100 relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-crimson-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-navy-900 text-sm">Badrane International School</p>
                    <p className="text-gray-500 text-xs">Tanger, Maroc</p>
                  </div>
                  <a href="https://maps.google.com/?q=Tanger+Maroc" target="_blank" rel="noopener noreferrer"
                    className="bg-navy-900 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-crimson-600 transition-colors">
                    {c.mapBtn}
                  </a>
                </div>
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs><pattern id="map-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#132d79" strokeWidth="1"/></pattern></defs>
                  <rect width="100%" height="100%" fill="url(#map-grid)" />
                </svg>
              </div>
            </div>

            <div className="reveal card p-5">
              <h4 className="font-semibold text-navy-900 text-sm mb-4">{c.followUs}</h4>
              <div className="flex gap-3">
                {[
                  { name: 'Facebook',  href: 'https://www.facebook.com', color: 'hover:bg-blue-600' },
                  { name: 'Instagram', href: 'https://www.instagram.com', color: 'hover:bg-pink-600' },
                  { name: 'YouTube',   href: 'https://www.youtube.com',  color: 'hover:bg-red-600' },
                ].map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    className={`flex-1 py-2.5 bg-gray-100 ${s.color} hover:text-white text-gray-700 rounded-xl text-xs font-semibold text-center transition-all duration-200`}>
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 reveal card p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl text-navy-900 mb-3">{c.successTitle}</h3>
                <p className="text-gray-500 mb-6">{c.successMsg}</p>
                <button onClick={() => setSent(false)} className="btn-outline text-sm">{c.newMessage}</button>
              </div>
            ) : (
              <>
                <h3 className="font-heading text-2xl text-navy-900 mb-2">{c.formTitle}</h3>
                <p className="text-gray-500 text-sm mb-6">{c.formSubtitle}</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{c.fieldNom}</label>
                      <input name="nom" value={form.nom} onChange={handleChange} required placeholder={c.fieldNom.replace(' *','')} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{c.fieldEmail}</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="email@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{c.fieldSubject}</label>
                    <select name="sujet" value={form.sujet} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition bg-white">
                      <option value="">{c.subjectPlaceholder}</option>
                      {c.subjectOptions.map((opt, i) => (
                        <option key={i} value={['inscription','information','rendez-vous','autre'][i]}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{c.fieldMsg}</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder={c.msgPlaceholder} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition resize-none" />
                  </div>
                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-4 disabled:opacity-60">
                    {submitting ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                    {submitting ? '...' : c.submitBtn}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
