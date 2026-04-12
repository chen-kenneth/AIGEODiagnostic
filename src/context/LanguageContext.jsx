import { createContext, useContext, useState } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

/** Wrap the app with this to provide language state everywhere. */
export function LanguageProvider({ children }) {
  // Chinese is the default language
  const [lang, setLang] = useState('zh')

  const toggle = () => setLang(prev => (prev === 'zh' ? 'en' : 'zh'))

  // t is the full translation object for the current locale
  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * useLang()
 * Returns { lang, toggle, t } where:
 *   lang   – current locale code ('zh' | 'en')
 *   toggle – function to switch between zh ↔ en
 *   t      – translations object for the current locale
 *
 * To add a new language: add an entry to translations.js and
 * extend the toggle logic here.
 */
export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
