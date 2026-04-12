import { useLang } from '../context/LanguageContext'

export default function Process() {
  const { t } = useLang()
  const p = t.process

  return (
    <section>
      <div className="container">
        <div className="label">{p.label}</div>
        <h2>{p.title}</h2>

        <div className="steps">
          {p.steps.map((s, i) => (
            <div className="step" key={i}>
              <div className="step-num">{i + 1}</div>
              <div className="step-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="ongoing-note">
          <strong>{p.ongoingStrong}</strong> {p.ongoingSub}
        </div>
      </div>
    </section>
  )
}
