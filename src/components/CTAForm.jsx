import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { config } from '../config'
import { getUtm } from '../lib/attribution'

export default function CTAForm() {
  const [focusLang, setFocusLang] = useState('both')
  const [status, setStatus] = useState('idle') // idle | sending | done | error | unconfigured
  const { t } = useLang()
  const f = t.ctaForm

  const handleSubmit = async e => {
    e.preventDefault()
    const form = e.target
    const fd = new FormData(form)
    // 蜜罐反垃圾：正常用户看不到此字段，填了就是机器人
    if (fd.get('website2')) {
      setStatus('done')
      return
    }
    if (!config.formspreeId) {
      setStatus('unconfigured')
      return
    }
    setStatus('sending')
    const data = {
      name: fd.get('name'),
      website: fd.get('website'),
      city: fd.get('city'),
      languageFocus: focusLang,
      email: fd.get('email'),
      ...getUtm(),
    }
    try {
      const res = await fetch(`https://formspree.io/f/${config.formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('submit failed')
      setStatus('done')
      if (window.plausible) window.plausible('lead')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="cta-form" className="cta-section">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="label label-light">{f.label}</div>
        <h2>{f.title}</h2>
        <p className="cta-intro">{f.intro}</p>

        <div className="form-card">
          {status === 'done' ? (
            <div className="form-success" role="status">
              <div className="fs-check">✅</div>
              <h3>{f.successTitle}</h3>
              <p>{f.successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate={false}>
              <div className="form-row">
                <label htmlFor="name">{f.nameLbl}</label>
                <input type="text" id="name" name="name" placeholder={f.namePh} required autoComplete="name" />
              </div>
              <div className="form-row">
                <label htmlFor="website">{f.websiteLbl}</label>
                <input type="url" id="website" name="website" placeholder={f.websitePh} autoComplete="url" />
              </div>
              {/* 蜜罐字段：对用户隐藏 */}
              <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <label>Website</label>
                <input type="text" name="website2" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="form-row">
                <label htmlFor="city">{f.cityLbl}</label>
                <input
                  type="text" id="city" name="city" placeholder={f.cityPh}
                  defaultValue={f.cityDefault} autoComplete="address-level2"
                />
              </div>
              <div className="form-row">
                <label>{f.langLbl}</label>
                <div className="lang-toggle">
                  {f.langOptions.map(l => (
                    <button
                      key={l.key} type="button"
                      className={`lang-btn${focusLang === l.key ? ' active' : ''}`}
                      onClick={() => setFocusLang(l.key)}
                      aria-pressed={focusLang === l.key}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-row">
                <label htmlFor="email">{f.emailLbl}</label>
                <input type="email" id="email" name="email" placeholder={f.emailPh} required autoComplete="email" />
              </div>
              <button type="submit" className="form-submit" disabled={status === 'sending'}>
                {status === 'sending' ? '…' : f.submit}
              </button>
              {status === 'error' && (
                <p className="form-error" role="alert">{f.errorMsg}</p>
              )}
              {status === 'unconfigured' && (
                <p className="form-error" role="alert">
                  表单尚未接入提交接口（需在 src/config.js 填写 Formspree ID）。备用联系：{config.contactEmail}
                </p>
              )}
              <p className="form-sub">{f.subText}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
