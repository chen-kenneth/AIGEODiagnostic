import { useLang } from '../context/LanguageContext'

/** 关于 RankGeo — 真实信息，不虚构 */
export default function About() {
  const { t } = useLang()
  const a = t.about

  return (
    <section>
      <div className="container">
        <div className="label">{a.label}</div>
        <h2>{a.title}</h2>
        <p style={{ maxWidth: '640px', marginTop: '16px' }}>{a.body}</p>

        <div className="about-grid">
          {a.points.map((p, i) => (
            <div className="about-card" key={i}>
              <div className="about-num mono">0{i + 1}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>

        <p className="about-location">{a.location}</p>
      </div>
    </section>
  )
}
