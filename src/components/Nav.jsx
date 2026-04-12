import { useState } from 'react'
import { useLang } from '../context/LanguageContext'

export default function Nav() {
  const [logoError, setLogoError] = useState(false)
  const { lang, toggle, t } = useLang()

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#" className="nav-logo">
          {logoError ? (
            <span className="nav-logo-text">Rank<span>Geo</span>.ca</span>
          ) : (
            <img
              src="/logo-en.png"
              alt="RankGeo"
              style={{ height: '46px', width: 'auto' }}
              onError={() => setLogoError(true)}
            />
          )}
        </a>
        <div className="nav-right">
          <div className="lang-toggle-nav">
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
          <a href="#cta-form" className="btn-sm">{t.nav.cta}</a>
        </div>
      </div>
    </nav>
  )
}
