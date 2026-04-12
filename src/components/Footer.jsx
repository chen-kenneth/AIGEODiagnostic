import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLang()
  const f = t.footer

  return (
    <footer>
      <div className="footer-logo">
        Rank<span>Geo</span>.ca
      </div>
      <p className="footer-tagline">{f.tagline}</p>
      <p className="footer-location">{f.location}</p>
      <hr className="footer-divider" />
      <p className="footer-copy">{f.copy}</p>
    </footer>
  )
}
