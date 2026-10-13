import { useLang } from '../context/LanguageContext'

export default function Nav() {
  const { lang, toggle, t, homePath, location } = useLang()
  const onHome = location === '/' || location === '/en'
  const ctaHref = onHome ? '#cta-form' : `${homePath}#cta-form`
  // 导航栏深色底：统一用 rankgeo-navbar-dark.svg（语言中立），去白色胶囊
  const logoSrc = '/rankgeo-navbar-dark.svg'
  const logoAlt = 'RankGeo.ca'

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href={homePath} className="nav-logo" aria-label={logoAlt}>
          <img src={logoSrc} alt={logoAlt} />
        </a>
        <div className="nav-right">
          <a href={lang === 'zh' ? '/articles' : '/articles'} className="nav-link">
            {t.nav.articles}
          </a>
          <div className="lang-toggle-nav" role="group" aria-label="Language">
            <button
              className={lang === 'zh' ? 'active' : ''}
              onClick={() => lang !== 'zh' && toggle()}
            >
              中文
            </button>
            <button
              className={lang === 'en' ? 'active' : ''}
              onClick={() => lang !== 'en' && toggle()}
            >
              EN
            </button>
          </div>
          <a href={ctaHref} className="btn-sm">{t.nav.cta}</a>
        </div>
      </div>
    </nav>
  )
}
