import { useLang } from '../context/LanguageContext'

/** /privacy 隐私政策页 */
export default function Privacy() {
  const { t } = useLang()
  const p = t.privacy

  return (
    <section>
      <div className="container container-narrow">
        <h1>{p.title}</h1>
        <p className="article-meta mono">{p.updated}</p>
        {p.body.map((para, i) => (
          <p key={i} style={{ marginTop: '16px' }}>{para}</p>
        ))}
      </div>
    </section>
  )
}
