import { useLang } from '../context/LanguageContext'

export default function WhyUs() {
  const { t } = useLang()
  const w = t.whyUs

  return (
    <section>
      <div className="container">
        <div className="label">{w.label}</div>
        <h2>{w.title}</h2>

        <div className="reasons-grid">
          {w.reasons.map((r, i) => (
            <div className="reason-card" key={i}>
              <div className="reason-check">✓</div>
              <div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
