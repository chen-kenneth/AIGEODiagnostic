import { useLang } from '../context/LanguageContext'
import { getArticle } from '../lib/articles'

/** /articles/:slug 文章页 */
export default function ArticlePage({ slug }) {
  const { t, lang } = useLang()
  const a = t.articles
  const article = getArticle(slug, lang)

  if (!article) {
    return (
      <section>
        <div className="container">
          <h1>404</h1>
          <p><a href={lang === 'zh' ? "/articles" : "/en/articles"}>{a.backToList}</a></p>
        </div>
      </section>
    )
  }

  return (
    <article className="article-page">
      <div className="container container-narrow">
        <a href={lang === 'zh' ? "/articles" : "/en/articles"} className="article-back">{a.backToList}</a>
        <div className="label">{a.label}</div>
        <h1>{article.title}</h1>
        <p className="article-meta mono">
          {a.publishedOn} {article.date} · {a.byAuthor} {article.author}
        </p>
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
      </div>
    </article>
  )
}
