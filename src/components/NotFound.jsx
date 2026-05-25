import { useLanguage } from '../context/LanguageContext'
import { Link } from 'react-router-dom'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <img src="/icon.webp" alt="BIST" className="h-16 w-auto mb-8 opacity-80" />
      <p className="text-8xl font-extrabold text-navy-900 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        {t.notFound?.title || 'Page introuvable'}
      </h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        {t.notFound?.subtitle || "La page que vous cherchez n'existe pas ou a été déplacée."}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-full font-medium hover:bg-navy-800 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t.notFound?.back || "Retour à l'accueil"}
      </Link>
    </div>
  )
}
