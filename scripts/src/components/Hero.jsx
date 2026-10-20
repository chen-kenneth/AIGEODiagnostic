import { useLang } from '../context/LanguageContext'

/**
 * Hero — 深色科技风
 * 左：提问式主标题 + 副标题 + 双 CTA
 * 右：AI 问答模拟演示卡（明确标注"模拟演示"，非真实截图）
 */
export default function Hero() {
  const { t } = useLang()
  const h = t.hero

  return (
    <section className="hero hero-dark">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="hero-badge mono">{h.badge}</div>
          <h1 className="hero-headline">{h.headline}</h1>
          <p className="hero-sub">{h.sub}</p>
          <div className="hero-ctas">
            <a href="#cta-form" className="btn-primary">{h.cta}</a>
            <a href="#report-sample" className="btn-ghost">{h.ctaSecondary}</a>
          </div>
        </div>

        <div className="ai-demo" role="img" aria-label={h.demoBadge}>
          <div className="ai-demo-head">
            <span className="ai-demo-badge mono">{h.demoBadge}</span>
            <span className="ai-demo-title">{h.demoTitle}</span>
          </div>
          <div className="ai-demo-query mono">{h.demoQuery}</div>
          <div className="ai-demo-answer">
            {h.demoAnswer.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <ol className="ai-demo-list">
              {h.demoEntries.map((e, i) => (
                <li key={i}>
                  <strong>{e.name}</strong>
                  <span>{e.note}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="ai-demo-footnote">{h.demoFootnote}</p>
          <p className="ai-demo-caption">{h.demoCaption}</p>
        </div>
      </div>
    </section>
  )
}
