import { useState } from 'react'
import { useLang } from '../context/LanguageContext'

export default function FAQ() {
  const [open, setOpen] = useState(null)
  const { t } = useLang()
  const f = t.faq

  const toggle = i => setOpen(open === i ? null : i)

  return (
    <section className="section-alt">
      <div className="container">
        <div className="label">{f.label}</div>
        <h2>{f.title}</h2>

        <div className="faq-list">
          {f.items.map((faq, i) => (
            <div className={`faq-item${open === i ? ' open' : ''}`} key={i}>
              <button className="faq-q" onClick={() => toggle(i)}>
                {faq.q}
                <span className="faq-arrow">▼</span>
              </button>
              <div className="faq-a">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
