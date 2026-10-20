import { useLang } from '../context/LanguageContext'

export default function WhatWeDo() {
  const { t } = useLang()
  const w = t.whatWeDo

  return (
    <section className="section-alt">
      <div className="container">
        <div className="label">{w.label}</div>
        <h2>{w.title}</h2>
        <p style={{ maxWidth: '600px', marginTop: '16px' }}>{w.intro}</p>

        <div className="services-grid">
          {w.services.map((s, i) => (
            <div className="service-card" key={i}>
              <div className="sc-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="takeaway">
          <strong>{w.takeaway}</strong>
        </div>
      </div>
    </section>
  )
}
