import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

const CAT_MAP = {
  'Vie scolaire':  1,
  'Activités':     2,
  'Infrastructure':3,
  'Événements':    4,
  'Autre':         0,
}

export default function Gallery() {
  const { t } = useLanguage()
  const g = t.gallery
  const [activeCategory, setActiveCategory] = useState(0)
  const [images, setImages] = useState([])
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.data) setImages(data.data) })
      .catch(() => {})
  }, [])

  const filtered = images.filter(img => {
    if (activeCategory === 0) return true
    const catIdx = CAT_MAP[img.category] ?? 0
    return catIdx === activeCategory
  })

  return (
    <section id="galerie" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12 reveal">
          <span className="badge mb-4">{g.badge}</span>
          <h2 className="section-title mx-auto">
            {g.title} <em className="not-italic text-crimson-600">{g.titleEm}</em>
          </h2>
          <p className="section-subtitle mx-auto text-center">{g.subtitle}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10 reveal">
          {g.categories.map((cat, i) => (
            <button key={i} onClick={() => setActiveCategory(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === i ? 'bg-navy-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {images.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">{g.empty || 'Aucune photo disponible'}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-sm">{g.noneInCategory || 'Aucune photo dans cette catégorie'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((img, i) => (
              <button
                key={img._id}
                onClick={() => setLightbox(img)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                style={{ minHeight: '192px', animation: `fadeUp 0.5s ease both`, animationDelay: `${i * 0.06}s` }}
              >
                <img
                  src={img.thumbnailUrl || img.url}
                  alt={img.caption || img.originalName}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/40 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {img.caption && <p className="text-white text-sm font-semibold">{img.caption}</p>}
                  <p className="text-white/70 text-xs">{img.category}</p>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}

        {lightbox && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
              <img
                src={lightbox.url}
                alt={lightbox.caption || lightbox.originalName}
                className="w-full max-h-[80vh] object-contain rounded-2xl"
              />
              {lightbox.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-6 rounded-b-2xl">
                  <p className="text-white font-semibold">{lightbox.caption}</p>
                  <p className="text-white/70 text-sm">{lightbox.category}</p>
                </div>
              )}
              <button onClick={() => setLightbox(null)} className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
