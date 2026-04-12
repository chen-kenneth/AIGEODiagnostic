import { useState } from 'react'
import { useLang } from '../context/LanguageContext'

export default function CTAForm() {
  const [focusLang, setFocusLang] = useState('both')
  const [submitted, setSubmitted] = useState(false)
  const { t } = useLang()
  const f = t.ctaForm

  // Keep selected focus key in sync when UI language changes
  // (options have the same keys in both locales, so state is preserved)
  const handleSubmit = e => {
    e.preventDefault()
    // TODO: replace with your form submission endpoint
    setSubmitted(true)
  }

  return (
    <section id="cta-form" className="cta-section">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="label label-light">{f.label}</div>
        <h2>{f.title}</h2>
        <p className="cta-intro">{f.intro}</p>

        <div className="form-card">
          {submitted ? (
            <div className="form-success">
              <div className="fs-check">✅</div>
              <h3>{f.successTitle}</h3>
              <p>{f.successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="name">{f.nameLbl}</label>
                <input type="text" id="name" name="name" placeholder={f.namePh} required />
              </div>
              <div className="form-row">
                <label htmlFor="website">{f.websiteLbl}</label>
                <input type="url" id="website" name="website" placeholder={f.websitePh} />
              </div>
              <div className="form-row">
                <label htmlFor="city">{f.cityLbl}</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder={f.cityPh}
                  defaultValue={f.cityDefault}
                />
              </div>
              <div className="form-row">
                <label>{f.langLbl}</label>
                <div className="lang-toggle">
                  {f.langOptions.map(l => (
                    <button
                      key={l.key}
                      type="button"
                      className={`lang-btn${focusLang === l.key ? ' active' : ''}`}
                      onClick={() => setFocusLang(l.key)}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-row">
                <label htmlFor="email">{f.emailLbl}</label>
                <input type="email" id="email" name="email" placeholder={f.emailPh} required />
              </div>
              <button type="submit" className="form-submit">{f.submit}</button>
              <p className="form-sub">{f.subText}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
