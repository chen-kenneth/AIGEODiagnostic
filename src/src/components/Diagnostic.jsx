import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'

export default function Diagnostic() {
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)
  const { t } = useLang()
  const d = t.diagnostic

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section-dark" ref={ref}>
      <div className="container">
        <div className="label label-light">{d.label}</div>
        <h2>{d.title}</h2>
        <p style={{ maxWidth: '560px', marginTop: '16px' }}>{d.intro}</p>

        <div className="insight-card">
          <div className="insight-inner-label">{d.insightLabel}</div>
          <div className="insight-bars">
            <div>
              <div className="insight-bar-label">
                <span>{d.youLabel}</span>
                <span style={{ color: 'var(--blue-lt)', fontWeight: 700 }}>{d.youPct}</span>
              </div>
              <div className="insight-bar-track">
                <div
                  className="insight-bar-fill you-bar"
                  style={{ width: animated ? '18%' : '0%' }}
                />
              </div>
            </div>
            <div>
              <div className="insight-bar-label">
                <span>{d.compLabel}</span>
                <span style={{ color: 'var(--green-lt)', fontWeight: 700 }}>{d.compPct}</span>
              </div>
              <div className="insight-bar-track">
                <div
                  className="insight-bar-fill comp-bar"
                  style={{ width: animated ? '43%' : '0%' }}
                />
              </div>
            </div>
          </div>
          <p className="insight-note">{d.insightNote}</p>
        </div>

        <a href="#cta-form" className="btn-primary">{d.cta}</a>
        <p className="diag-sub-note">{d.subNote}</p>
      </div>
    </section>
  )
}
