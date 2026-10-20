/**
 * 预渲染脚本（手写 SSG，替代已停止维护的 vite-plugin-prerender）
 *
 * 流程：vite build（客户端）→ vite build --ssr（服务端 bundle）
 *      → 逐路由 renderToString → 写入 dist/<route>/index.html
 *      → 生成 sitemap.xml + robots.txt
 *
 * 用法：npm run build
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const BASE = 'https://www.rankgeo.ca'

console.log('→ vite build (client)')
execSync('npx vite build', { cwd: root, stdio: 'inherit' })

console.log('→ vite build (ssr)')
execSync('npx vite build --ssr src/entry-server.jsx --outDir dist-ssr', {
  cwd: root,
  stdio: 'inherit',
})

const template = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8')
if (!template.includes('<!--HEAD-->') || !template.includes('<div id="root"></div>')) {
  throw new Error('dist/index.html 缺少 <!--HEAD--> 或 <div id="root"></div> 占位符')
}

const { renderRoute, listRoutes } = await import(path.join(root, 'dist-ssr/entry-server.js'))
const routes = listRoutes()

for (const route of routes) {
  const { html, head, lang } = renderRoute(route.path)
  const htmlLang = lang === 'zh' ? 'zh-Hans-CN' : 'en-CA'
  const page = template
    .replace('<!--HEAD-->', head)
    .replace('<html lang="zh-Hans-CN">', `<html lang="${htmlLang}">`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  const outFile = path.join(root, 'dist', route.file)
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, page)
  console.log(`  ✓ ${route.path} → ${route.file} (${(page.length / 1024).toFixed(1)} KB)`)
}

// sitemap.xml（lastmod 取内容源文件的实际修改日期）
// TODO(未来): 改为各页面的内容日期字段（如文章 frontmatter date），目前按文件 mtime 已满足需求，不阻塞部署。
function mtimeOf(p) {
  try {
    return fs.statSync(p).mtime
  } catch {
    return new Date(0)
  }
}
function maxMtime(paths) {
  let m = new Date(0)
  for (const p of paths) {
    const full = path.join(root, p)
    let st
    try {
      st = fs.statSync(full)
    } catch {
      continue
    }
    if (st.isDirectory()) {
      for (const f of fs.readdirSync(full)) {
        const t = mtimeOf(path.join(full, f))
        if (t > m) m = t
      }
    } else if (st.mtime > m) {
      m = st.mtime
    }
  }
  return m
}
const fmtDate = d => d.toISOString().slice(0, 10)
function lastmodFor(routePath) {
  if (routePath.startsWith('/articles/')) {
    const slug = routePath.split('/')[2]
    return fmtDate(mtimeOf(path.join(root, 'src/content/articles', `${slug}.md`)))
  }
  const map = {
    '/': ['src/content/realtors.js', 'src/content/articles', 'src/components'],
    '/en': ['src/content/realtors.js', 'src/content/articles', 'src/components'],
    '/articles': ['src/content/articles'],
    '/privacy': ['src/components/Privacy.jsx', 'src/content/realtors.js'],
    '/en/privacy': ['src/components/Privacy.jsx', 'src/content/realtors.js'],
  }
  return fmtDate(maxMtime(map[routePath] || ['src']))
}
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(
    r =>
      `  <url><loc>${BASE}${r.path === '/' ? '/' : r.path + '/'}</loc><lastmod>${lastmodFor(r.path)}</lastmod><changefreq>weekly</changefreq></url>`,
  ),
  '</urlset>',
].join('\n')
fs.writeFileSync(path.join(root, 'dist/sitemap.xml'), sitemap)
console.log('  ✓ sitemap.xml')

// robots.txt（区分训练爬虫与搜索/检索爬虫）
const robots = `User-agent: *
Allow: /

# AI 检索爬虫（搜索与引用）
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Bytespider
Allow: /

# AI 训练爬虫（允许进入训练数据）
User-agent: GPTBot
Allow: /
User-agent: CCBot
Allow: /

Sitemap: ${BASE}/sitemap.xml
`
fs.writeFileSync(path.join(root, 'dist/robots.txt'), robots)
console.log('  ✓ robots.txt')
console.log(`\n预渲染完成：${routes.length} 个路由`)
