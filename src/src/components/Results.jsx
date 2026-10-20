import { useLang } from '../context/LanguageContext'

export default function Results() {
  const { t } = useLang()
  const r = t.results

  return (
    <section>
      <div className="container">
        <div className="label">{r.label}</div>
        <h2>{r.title}</h2>

        <div className="before-after">
          <div className="ba-card before">
            <div className="ba-header"><span>❌</span> {r.before}</div>
            {r.beforeItems.map((item, i) => (
              <div className="ba-item" key={i}>
                <div className="ba-dot">✕</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="ba-card after">
            <div className="ba-header"><span>✅</span> {r.after}</div>
            {r.afterItems.map((item, i) => (
              <div className="ba-item" key={i}>
                <div className="ba-dot">✓</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="highlight-box">
          <div className="hb-icon">📈</div>
          <p><strong>{r.highlight}</strong></p>
        </div>
      </div>
    </section>
  )
}
