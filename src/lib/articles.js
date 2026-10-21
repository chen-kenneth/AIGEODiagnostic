import { marked } from 'marked'

/** 构建时 + 客户端统一用 import.meta.glob 读取 md 原文 */
const modules = import.meta.glob('../content/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) return { data: {}, body: raw }
  const data = {}
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { data, body: m[2] }
}

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

export function getArticles(lang = 'zh') {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const { data, body } = parseFrontmatter(raw)
      return {
        slug: data.slug || slugFromPath(path),
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        dateModified: data.dateModified || data.date || '',
        author: data.author || 'RankGeo',
        lang: data.language || 'zh',
        image: data.image || '',
        html: marked.parse(body),
      }
    })
    .filter(a => a.lang === lang && a.title)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

export function getArticle(slug, lang = 'zh') {
  return getArticles(lang).find(a => a.slug === slug)
}

export function articleUrl(article) {
  const prefix = article.lang === 'en' ? '/en' : ''
  return `${prefix}/articles/${article.slug}`
}
