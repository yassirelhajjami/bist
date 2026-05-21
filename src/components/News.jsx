import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

const COLORS = [
  { gradient: 'from-purple-400 to-indigo-500', categoryColor: 'bg-purple-100 text-purple-700' },
  { gradient: 'from-emerald-400 to-teal-500',  categoryColor: 'bg-emerald-100 text-emerald-700' },
  { gradient: 'from-amber-400 to-orange-500',  categoryColor: 'bg-amber-100 text-amber-700' },
  { gradient: 'from-blue-400 to-navy-500',     categoryColor: 'bg-blue-100 text-blue-700' },
]

function fmtDate(dateStr, lang) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function News() {
  const { t, lang } = useLanguage()
  const n = t.news
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/api/posts?status=published&limit=4')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.data?.length) setPosts(data.data) })
      .catch(() => {})
  }, [])

  // Fall back to i18n static articles if API returns nothing
  const articles = posts.length
    ? posts.map((p, i) => ({
        title:    p.title,
        excerpt:  p.excerpt || '',
        category: p.category || '',
        date:     fmtDate(p.publishDate || p.createdAt, lang),
        coverImage: p.coverImage || null,
        ...COLORS[i % COLORS.length],
      }))
    : n.articles.map((a, i) => ({ ...a, ...COLORS[i % COLORS.length] }))

  if (!articles.length) return null

  const [featured, ...rest] = articles

  return (
    <section id="actualites" className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 reveal">
          <div>
            <span className="badge mb-4">{n.badge}</span>
            <h2 className="section-title">
              {n.title} <em className="not-italic text-crimson-600">{n.titleEm}</em>
            </h2>
          </div>
          <a href="#" className="btn-outline text-sm shrink-0">
            {n.allNews}
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Featured */}
          <div className="reveal lg:col-span-2 card group overflow-hidden hover:-translate-y-1">
            {featured.coverImage ? (
              <img src={featured.coverImage} alt={featured.title} className="h-56 w-full object-cover" />
            ) : (
              <div className={`h-56 bg-gradient-to-br ${featured.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-navy-900/20 group-hover:bg-navy-900/10 transition-colors duration-300" />
                <div className="absolute top-4 left-4">
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${featured.categoryColor}`}>{featured.category}</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <p className="text-xs font-medium text-gray-600">{featured.date}</p>
                </div>
              </div>
            )}
            <div className="p-6">
              {featured.coverImage && (
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${featured.categoryColor}`}>{featured.category}</span>
                  <span className="text-xs text-gray-400">{featured.date}</span>
                </div>
              )}
              <h3 className="font-heading text-xl text-navy-900 mb-3 group-hover:text-crimson-600 transition-colors">{featured.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-crimson-600 transition-colors group-hover:gap-3">
                {n.readMore}
                <svg className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Side cards */}
          <div className="flex flex-col gap-4">
            {rest.map((article, i) => (
              <div key={i} className="reveal card group overflow-hidden hover:-translate-y-0.5 flex gap-0 p-0" style={{ transitionDelay: `${i * 0.1}s` }}>
                {article.coverImage ? (
                  <img src={article.coverImage} alt={article.title} className="w-24 sm:w-28 h-full object-cover shrink-0" />
                ) : (
                  <div className={`w-24 sm:w-28 bg-gradient-to-br ${article.gradient} shrink-0 relative`}>
                    <div className="absolute inset-0 bg-navy-900/20" />
                  </div>
                )}
                <div className="p-4 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${article.categoryColor}`}>{article.category}</span>
                    </div>
                    <h3 className="font-heading text-sm text-navy-900 leading-tight mb-1.5 group-hover:text-crimson-600 transition-colors line-clamp-2">{article.title}</h3>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{article.date}</span>
                    <a href="#" className="text-xs font-semibold text-navy-600 hover:text-crimson-600 transition-colors flex items-center gap-1">
                      {n.readShort}
                      <svg className="w-3 h-3 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
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
