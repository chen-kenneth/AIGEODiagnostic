import { createContext, useContext } from 'react'
import { useLocation } from 'wouter'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)
const LANG_KEY = 'rankgeo-lang'

/** 路由 → 语言：/en* 为英文，其余为中文 */
export function langFromPath(path) {
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'zh'
}

/** 语言切换时的目标路由（文章暂只有中文版，保持不动） */
function toggleTarget(path, lang) {
  if (lang === 'zh') {
    if (path === '/') return '/en'
    if (path === '/privacy') return '/en/privacy'
    return path // /articles* 暂无英文版，保持当前页
  }
  // en → zh
  if (path === '/en') return '/'
  if (path === '/en/privacy') return '/privacy'
  return path
}

export function LanguageProvider({ children }) {
  const [location, navigate] = useLocation()
  const lang = langFromPath(location)
  const t = translations[lang]

  const toggle = () => {
    const target = toggleTarget(location, lang)
    try { localStorage.setItem(LANG_KEY, lang === 'zh' ? 'en' : 'zh') } catch {}
    navigate(target)
  }
  const homePath = lang === 'zh' ? '/' : '/en'

  return (
    <LanguageContext.Provider value={{ lang, toggle, t, homePath, location }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
