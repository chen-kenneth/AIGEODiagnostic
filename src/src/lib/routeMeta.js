import { realtors } from '../content/realtors.js'
import { getArticles, getArticle } from './articles.js'

const BASE = 'https://www.rankgeo.ca'
const OG_IMAGE_CN = `${BASE}/hero-cn.png`
const OG_IMAGE_EN = `${BASE}/hero-en.png`
const LOGO_IMAGE = `${BASE}/logo-en-maple.png`

export function routeLang(path) {
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'zh'
}

export function htmlLang(lang) {
  return lang === 'zh' ? 'zh-Hans-CN' : 'en-CA'
}

/** 全部待预渲染路由 */
export function listRoutes() {
  const routes = [
    { path: '/', file: 'index.html' },
    { path: '/en', file: 'en/index.html' },
    { path: '/articles', file: 'articles/index.html' },
    { path: '/privacy', file: 'privacy/index.html' },
    { path: '/en/privacy', file: 'en/privacy/index.html' },
  ]
  for (const a of getArticles('zh')) {
    if (a.slug === 'placeholder') continue
    routes.push({ path: `/articles/${a.slug}`, file: `articles/${a.slug}/index.html` })
  }
  return routes
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function jsonLd(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`
}

function orgSchema(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'RankGeo',
    url: `${BASE}/`,
    logo: LOGO_IMAGE,
    description: realtors[lang].meta.description,
    areaServed: { '@type': 'City', name: 'Ottawa' },
    knowsAbout: ['Generative Engine Optimization', 'AI Search Visibility', 'Real Estate Marketing'],
    inLanguage: ['zh-CN', 'en'],
  }
}

function faqSchema(lang) {
  const items = realtors[lang].faq.items
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

function webPageSchema(name, url, lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url,
    inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
    isPartOf: { '@type': 'WebSite', name: 'RankGeo', url: `${BASE}/` },
  }
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

/** 每路由的完整 <head> 内容（title/meta/OG/canonical/hreflang/JSON-LD/统计） */
export function headFor(path) {
  const lang = routeLang(path)
  const t = realtors[lang]
  const canonical = `${BASE}${path === '/' ? '/' : path + '/'}`

  let title = t.meta.title
  let description = t.meta.description
  let ogType = 'website'
  let schemas = [orgSchema(lang)]

  const articleMatch = path.match(/^\/articles\/([\w-]+)$/)
  if (path === '/' || path === '/en') {
    schemas.push(faqSchema(lang))
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'RankGeo',
      url: `${BASE}/`,
      inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
    })
    schemas.push(webPageSchema(title, canonical, lang))
  } else if (path === '/articles') {
    title = `${t.articles.title} | RankGeo`
    description = t.articles.intro
    const list = getArticles('zh')
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      url: canonical,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: list.map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${BASE}/articles/${a.slug}/`,
          name: a.title,
        })),
      },
    })
    schemas.push(webPageSchema(title, canonical, lang))
    schemas.push(breadcrumbSchema([
      { name: 'RankGeo', url: `${BASE}/` },
      { name: title.replace(' | RankGeo', ''), url: canonical },
    ]))
  } else if (articleMatch) {
    const a = getArticle(articleMatch[1], 'zh')
    if (a) {
      title = `${a.title} | RankGeo`
      description = a.description
      ogType = 'article'
      schemas = [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: a.title,
          description: a.description,
          image: a.image || OG_IMAGE_CN,
          datePublished: a.date,
          dateModified: a.dateModified,
          author: { '@type': 'Organization', name: 'RankGeo', url: `${BASE}/` },
          publisher: { '@type': 'Organization', name: 'RankGeo', url: `${BASE}/` },
          inLanguage: 'zh-CN',
          mainEntityOfPage: canonical,
        },
        webPageSchema(title, canonical, 'zh'),
        breadcrumbSchema([
          { name: 'RankGeo', url: `${BASE}/` },
          { name: t.articles.title, url: `${BASE}/articles/` },
          { name: a.title, url: canonical },
        ]),
      ]
    }
  } else if (path === '/privacy' || path === '/en/privacy') {
    title = `${t.privacy.title} | RankGeo`
    description = t.privacy.body[0]
    schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        url: canonical,
        inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
      },
    ]
  }

  // hreflang：只有真实成对的语言版本才配对
  const pairs = { '/': '/en', '/en': '/', '/privacy': '/en/privacy', '/en/privacy': '/privacy' }
  let hreflang = ''
  if (pairs[path]) {
    const other = pairs[path]
    const otherLang = routeLang(other)
    hreflang = [
      `<link rel="canonical" href="${canonical}" />`,
      `<link rel="alternate" hreflang="${htmlLang(lang)}" href="${BASE}${path === '/' ? '/' : path + '/'}" />`,
      `<link rel="alternate" hreflang="${htmlLang(otherLang)}" href="${BASE}${other === '/' ? '/' : other + '/'}" />`,
      `<link rel="alternate" hreflang="x-default" href="${BASE}/" />`,
    ].join('\n    ')
  } else {
    hreflang = `<link rel="canonical" href="${canonical}" />`
  }

  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta property="og:title" content="${esc(lang === 'zh' ? t.meta.ogTitle : title)}" />`,
    `<meta property="og:description" content="${esc(lang === 'zh' ? t.meta.ogDescription : description)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${lang === 'zh' ? OG_IMAGE_CN : OG_IMAGE_EN}" />`,
    `<meta property="og:locale" content="${lang === 'zh' ? 'zh_CN' : 'en_US'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    hreflang,
    schemas.map(jsonLd).join('\n    '),
    `<script defer data-domain="rankgeo.ca" src="https://plausible.io/js/script.js"></script>`,
  ].join('\n    ')
}
