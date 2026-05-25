import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

export default function Admissions() {
  const { t } = useLanguage()
  const a = t.admissions
  const [content, setContent] = useState({})
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', niveau: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('page_content').select('key, value').eq('page', 'admissions')
      .then(({ data }) => { if (data) setContent(Object.fromEntries(data.map(r => [r.key, r.value]))) })
      .catch(() => {})
  }, [])

  const c = content
  const subtitle = c.subtitle || a.subtitle

  const steps = [1, 2, 3, 4].map((n, i) => ({
    title: c[`step_${n}_title`] || a.steps[i]?.title,
    desc:  c[`step_${n}_desc`]  || a.steps[i]?.desc,
  }))

  const docs = [1, 2, 3, 4, 5, 6].map((n, i) =>
    c[`doc_${n}`] || a.docs[i]
  ).filter(Boolean)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const { error: err } = await supabase.from('form_submissions').insert({
        type: 'registration',
        name: `${form.prenom} ${form.nom}`.trim(),
        email: form.email,
        phone: form.telephone,
        level: form.niveau,
        message: form.message,
        data: { nom: form.nom, prenom: form.prenom, email: form.email },
      })
      if (err) throw err
      setSubmitted(true)
    } catch {
      setError(a.submitError || "Erreur lors de l'envoi. Réessayez.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="admissions" className="section-padding bg-navy-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-crimson-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-navy-700/30 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        <div className="text-center mb-14 reveal">
          <span className="inline-block bg-crimson-900/50 text-crimson-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">{a.badge}</span>
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
            {c.section_title || a.title} <em className="not-italic text-crimson-400">{a.titleEm}</em>
          </h2>
          <p className="text-navy-300 max-w-xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="reveal">
              <h3 className="font-heading text-xl text-white mb-6">{a.stepsTitle}</h3>
              <div className="space-y-5">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-crimson-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">{i + 1}</div>
                      {i < steps.length - 1 && <div className="w-0.5 h-8 bg-navy-700 mt-1" />}
                    </div>
                    <div className="pb-1">
                      <h4 className="font-semibold text-white text-sm mb-1">{step.title}</h4>
                      <p className="text-navy-300 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal bg-navy-900/50 border border-navy-700 rounded-2xl p-6">
              <h3 className="font-heading text-lg text-white mb-4">{a.docsTitle}</h3>
              <ul className="space-y-2.5">
                {docs.map((doc, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-navy-300">
                    <svg className="w-4 h-4 text-crimson-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="reveal bg-white rounded-3xl p-8 shadow-2xl">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl text-navy-900 mb-3">{a.successTitle}</h3>
                <p className="text-gray-500">{a.successMsg}</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 btn-outline text-sm">{a.newRequest}</button>
              </div>
            ) : (
              <>
                <h3 className="font-heading text-2xl text-navy-900 mb-6">{a.formTitle}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{a.fieldNom}</label>
                      <input name="nom" value={form.nom} onChange={handleChange} required placeholder={a.placeholderNom} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{a.fieldPrenom}</label>
                      <input name="prenom" value={form.prenom} onChange={handleChange} required placeholder={a.placeholderPrenom} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{a.fieldEmail}</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="email@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{a.fieldTel}</label>
                    <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} required placeholder="+212 6XX XXX XXX" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{a.fieldLevel}</label>
                    <select name="niveau" value={form.niveau} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition bg-white">
                      <option value="">{a.levelPlaceholder}</option>
                      {a.levelOptions.map((opt, i) => (
                        <option key={i} value={['maternelle','primaire','college','lycee'][i]}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{a.fieldMsg}</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder={a.msgPlaceholder} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition resize-none" />
                  </div>
                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60">
                    {submitting ? '...' : a.submitBtn}
                    {!submitting && (
                      <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
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
