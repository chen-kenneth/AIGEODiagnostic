import { useLang } from '../context/LanguageContext'

const icons = ['💬', '🏡', '🤝']

export default function Shift() {
  const { t } = useLang()
  const s = t.shift

  return (
    <section>
      <div className="container">
        <div className="label">{s.label}</div>
        <h2>{s.title}</h2>
        <p style={{ maxWidth: '600px', marginTop: '16px' }}>{s.intro}</p>

        <div className="queries-grid">
          {s.queries.map((text, i) => (
            <div className="query-card" key={i}>
              <div className="query-icon">{icons[i]}</div>
              <p className="query-text">{text}</p>
            </div>
          ))}
        </div>

        <p>{s.aiNote}</p>

        <div className="highlight-box" style={{ marginTop: '24px' }}>
          <div className="hb-icon">⚡</div>
          <p>
            <strong>{s.highlightStrong}</strong>{' '}
            {s.highlightSub}
          </p>
        </div>
      </div>
    </section>
  )
}
