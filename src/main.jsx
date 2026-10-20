import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { persistUtm } from './lib/attribution.js'

// 预渲染 HTML 由 hydrateRoot 接管（非 createRoot 重渲染），
// 首屏 DOM 与服务端渲染一致时无 hydration 警告。
persistUtm()

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <App />
  </StrictMode>,
)
