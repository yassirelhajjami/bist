import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function Navbar() {
  const { t, lang, setLang } = useLanguage()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [active, setActive]       = useState('#accueil')

  const navLinks = [
    { label: t.nav.home,       href: '#accueil' },
    { label: t.nav.about,      href: '#apropos' },
    { label: t.nav.levels,     href: '#niveaux' },
    { label: t.nav.pedagogy,   href: '#pedagogie' },
    { label: t.nav.admissions, href: '#admissions' },
    { label: t.nav.gallery,    href: '#galerie' },
    { label: t.nav.news,       href: '#actualites' },
    { label: t.nav.contact,    href: '#contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (href) => {
    setActive(href)
    setMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={() => { handleClick('#accueil'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex items-center gap-3 group">
          <img src="/icon.webp" alt="Badrane International School" className="h-10 w-auto object-contain" />
          <span className={`hidden sm:block font-heading font-bold text-base leading-tight transition-colors duration-300 ${scrolled ? 'text-navy-900' : 'text-white'}`}>
            Badrane<br />International School
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleClick(link.href)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                active === link.href
                  ? 'bg-navy-900 text-white'
                  : scrolled
                  ? 'text-navy-800 hover:bg-navy-50 hover:text-navy-900'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side: lang toggle + CTA + hamburger */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
              scrolled
                ? 'border-navy-200 text-navy-700 hover:bg-navy-50'
                : 'border-white/30 text-white hover:bg-white/10'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            {t.nav.langToggle}
          </button>

          <a
            href="#admissions"
            onClick={() => handleClick('#admissions')}
            className="hidden md:inline-flex btn-primary text-sm py-2 px-5"
          >
            {t.nav.enroll}
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-navy-900 hover:bg-navy-50' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white shadow-lg border-t border-gray-100 py-3 px-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleClick(link.href)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-1 ${
                active === link.href ? 'bg-navy-900 text-white' : 'text-navy-800 hover:bg-navy-50'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => { setLang(lang === 'fr' ? 'ar' : 'fr'); setMenuOpen(false) }}
              className="flex-1 py-2.5 border border-navy-200 text-navy-700 rounded-xl text-sm font-semibold text-center"
            >
              {t.nav.langToggle}
            </button>
            <a
              href="#admissions"
              onClick={() => handleClick('#admissions')}
              className="flex-1 btn-primary justify-center text-sm py-2.5"
            >
              {t.nav.enroll}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
