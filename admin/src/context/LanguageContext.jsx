import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../i18n/index'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('admin_lang') || 'fr')

  const setLang = (l) => {
    setLangState(l)
    localStorage.setItem('admin_lang', l)
  }

  useEffect(() => {
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const t = translations[lang]
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
