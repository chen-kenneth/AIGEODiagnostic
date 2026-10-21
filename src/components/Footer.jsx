import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { t, lang } = useLang()
  const f = t.footer
  const homePath = lang === 'zh' ? '/' : '/en'
  const privacyPath = lang === 'zh' ? '/privacy' : '/en/privacy'
  // 页脚 logo：白字深色版，直接放深色页脚上（不再用白色胶囊）
  const logoSrc = '/logo-footer-dark.png'
  const logoAlt = 'RankGeo.ca 优排智能'

  return (
    <footer>
      <div className="footer-logo">
        <img src={logoSrc} alt={logoAlt} />
      </div>
      <p className="footer-tagline">{f.tagline}</p>
      <p className="footer-location">{f.location}</p>
      <p className="footer-email">
        <a href={`mailto:${f.email}`}>{f.email}</a>
      </p>
      <nav className="footer-links" aria-label="Footer">
        <a href={homePath}>RankGeo</a>
        <a href="/articles">{f.articles}</a>
        <a href={privacyPath}>{f.privacy}</a>
      </nav>
      <hr className="footer-divider" />
      <p className="footer-copy">{f.copy}</p>
    </footer>
  )
}
