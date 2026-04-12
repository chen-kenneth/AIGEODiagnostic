import { useLang } from '../context/LanguageContext'

export default function NicheFocus() {
  const { t } = useLang()
  const n = t.niche

  return (
    <section className="section-alt">
      <div className="container">
        <div className="label">{n.label}</div>
        <h2>{n.title}</h2>
        <p style={{ maxWidth: '580px', marginTop: '16px' }}>{n.intro}</p>

        <div className="bilingual-card">
          <div className="lang-card en">
            <div className="lc-flag">🇨🇦</div>
            <h3>{n.enTitle}</h3>
            <p>{n.enDesc}</p>
          </div>
          <div className="lang-card zh">
            <div className="lc-flag">🇨🇳</div>
            <h3>{n.zhTitle}</h3>
            <p>{n.zhDesc}</p>
          </div>
        </div>

        <div className="gap-highlight">
          <p><strong>{n.gapStrong}</strong></p>
          <p>{n.gapSub}</p>
        </div>
      </div>
    </section>
  )
}
