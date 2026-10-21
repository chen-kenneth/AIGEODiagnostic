import { useLang } from '../context/LanguageContext'
import PhoneDemo from './PhoneDemo'

/**
 * Hero — 深色科技风
 * 左：提问式主标题 + 副标题 + 双 CTA
 * 右：手机框 AI 问答动画（模拟演示）
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

        <PhoneDemo />
      </div>
    </section>
  )
}
