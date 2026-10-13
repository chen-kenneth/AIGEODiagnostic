import { useLang } from '../context/LanguageContext'
import { getArticles, articleUrl } from '../lib/articles'

/** /articles 文章列表页 */
export default function ArticlesIndex() {
  const { t, lang } = useLang()
  const a = t.articles
  const list = getArticles(lang)

  return (
    <section>
      <div className="container">
        <div className="label">{a.label}</div>
        <h1>{a.title}</h1>
        <p style={{ maxWidth: '600px', marginTop: '16px' }}>{a.intro}</p>

        <div className="article-cards" style={{ marginTop: '40px' }}>
          {list.map(item => (
            <a className="article-card" href={articleUrl(item)} key={item.slug}>
              <div className="ac-date mono">{item.date}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="ac-more">{a.readMore}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
