import { useLang } from '../context/LanguageContext'

/** "为什么重要" — 三块带数字+出处的可引用内容（数字均经原始来源核验） */
export default function WhyMatters() {
  const { t } = useLang()
  const w = t.whyMatters

  return (
    <section>
      <div className="container">
        <div className="label">{w.label}</div>
        <h2>{w.title}</h2>
        <p style={{ maxWidth: '600px', marginTop: '16px' }}>{w.intro}</p>

        <div className="stats-grid">
          {w.blocks.map((b, i) => (
            <article className="stat-card" key={i}>
              <div className="stat-num mono">{b.stat}</div>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
              <p className="stat-source">{b.source}</p>
              <p className="stat-caveat">{b.caveat}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
