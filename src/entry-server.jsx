import { renderToString } from 'react-dom/server'
import { AppShell } from './App.jsx'
import { headFor, listRoutes, routeLang } from './lib/routeMeta.js'

/** 纯静态 location hook：一次渲染，不订阅变化（SSR 无需响应式） */
const staticHook = path => {
  const hook = () => [path, () => {}]
  return hook
}

/** 供 scripts/prerender.mjs 调用的服务端渲染入口 */
export function renderRoute(path) {
  const html = renderToString(<AppShell hook={staticHook(path)} />)
  return { html, head: headFor(path), lang: routeLang(path) }
}

export { listRoutes }
