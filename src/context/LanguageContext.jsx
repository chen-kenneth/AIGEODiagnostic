import { createContext, useContext } from 'react'
import { useLocation } from 'wouter'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)
const LANG_KEY = 'rankgeo-lang'

/** 路由 → 语言：/en* 为英文，其余为中文 */
export function langFromPath(path) {
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'zh'
}

/** 语言切换时的目标路由（文章页中英成对，切换到同篇文章的另一语言版） */
function toggleTarget(rawPath, lang) {
  // 预渲染页 URL 带尾斜杠（如 /articles/slug/），先归一化再匹配
  const path = rawPath.length > 1 ? rawPath.replace(/\/$/, '') : rawPath
  if (lang === 'zh') {
    if (path === '/') return '/en'
    if (path === '/privacy') return '/en/privacy'
    if (path === '/articles') return '/en/articles'
    const m = path.match(/^\/articles\/([\w-]+)$/)
    if (m) return `/en/articles/${m[1]}`
    return rawPath
  }
  // en → zh
  if (path === '/en') return '/'
  if (path === '/en/privacy') return '/privacy'
  if (path === '/en/articles') return '/articles'
  const m = path.match(/^\/en\/articles\/([\w-]+)$/)
  if (m) return `/articles/${m[1]}`
  return rawPath
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
