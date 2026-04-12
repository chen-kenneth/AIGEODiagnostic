import { useLang } from '../context/LanguageContext'

export default function Hero() {
  const { t } = useLang()
  const h = t.hero

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-inner">
          <div>
            <div className="hero-badge">{h.badge}</div>
            <h1 className="hero-headline">
              {h.headlinePre}<span>{h.headlineHighlight}</span>{h.headlinePost}
            </h1>
            <p className="hero-sub">{h.sub}</p>
            <a href="#cta-form" className="btn-primary">{h.cta}</a>
          </div>

          <div>
            <div className="ai-card">
              <div className="ai-card-query">🔍 {h.aiQuery}</div>
              <div className="ai-card-qlabel">{h.aiLabel}</div>
              <div className="ai-entry">
                <div className="ai-rank">1</div>
                Sarah Li
                <span className="ai-star">⭐</span>
              </div>
              <div className="ai-entry you">
                <div className="ai-rank">2</div>
                {h.aiYou}
                <span className="ai-star">👈</span>
              </div>
              <div className="ai-entry">
                <div className="ai-rank">3</div>
                David Wong
                <span className="ai-star">⭐</span>
              </div>
              <div className="ai-footer">{h.aiFooter}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
