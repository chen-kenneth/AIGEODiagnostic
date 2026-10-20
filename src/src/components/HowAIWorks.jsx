import { useLang } from '../context/LanguageContext'

export default function HowAIWorks() {
  const { t } = useLang()
  const h = t.howAI

  return (
    <section className="section-alt">
      <div className="container">
        <div className="label">{h.label}</div>
        <h2>{h.title}</h2>
        <p style={{ maxWidth: '580px', marginTop: '16px' }}>{h.intro}</p>

        <div className="signals-grid">
          {h.signals.map((s, i) => (
            <div className="signal-card" key={i}>
              <div className="sig-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
