import { createContext, useContext, useEffect } from 'react'
import { useLocation } from 'wouter'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)
const LANG_KEY = 'rankgeo-lang'

/** 路由 → 语言：/en* 为英文，其余为中文 */
export function langFromPath(path) {
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'zh'
}

/** 浏览器语言 → 默认语言：非中文一律英文 */
export function browserLang() {
  const l = (navigator.language || navigator.userLanguage || 'zh').toLowerCase()
  return l.startsWith('zh') ? 'zh' : 'en'
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

  // 首次访问首页：按浏览器语言自动跳转（用户手动切换过则尊重其选择）
  useEffect(() => {
    if (location !== '/') return
    try {
      if (localStorage.getItem(LANG_KEY)) return
      if (browserLang() === 'en') {
        localStorage.setItem(LANG_KEY, 'en')
        navigate('/en', { replace: true })
      } else {
        localStorage.setItem(LANG_KEY, 'zh')
      }
    } catch {}
  }, [])

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
