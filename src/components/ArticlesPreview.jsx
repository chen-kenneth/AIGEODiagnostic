import { useLang } from '../context/LanguageContext'
import { getArticles, articleUrl } from '../lib/articles'

/** 首页"最新文章"区 */
export default function ArticlesPreview() {
  const { t, lang } = useLang()
  const a = t.articles
  const latest = getArticles(lang).slice(0, 3)

  if (!latest.length) return null

  return (
    <section className="section-alt">
      <div className="container">
        <div className="label">{a.label}</div>
        <h2>{a.title}</h2>
        <p style={{ maxWidth: '600px', marginTop: '16px' }}>{a.intro}</p>

        <div className="article-cards">
          {latest.map(item => (
            <a className="article-card" href={articleUrl(item)} key={item.slug}>
              <div className="ac-date mono">{item.date}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="ac-more">{a.readMore}</span>
            </a>
          ))}
        </div>

        <div style={{ marginTop: '28px' }}>
          <a href="/articles" className="btn-ghost">{a.viewAll}</a>
        </div>
      </div>
    </section>
  )
}
