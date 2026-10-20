/**
 * UTM 归因：首次落地页的 UTM 参数写入 sessionStorage，
 * 站内导航（/ ↔ /en ↔ /articles）后提交表单时仍能归因。
 */
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
const STORE_KEY = 'rg_utm'

export function persistUtm() {
  try {
    const q = new URLSearchParams(window.location.search)
    const stored = JSON.parse(sessionStorage.getItem(STORE_KEY) || '{}')
    let changed = false
    for (const k of UTM_KEYS) {
      const v = q.get(k)
      if (v) {
        stored[k] = v
        changed = true
      }
    }
    if (changed) sessionStorage.setItem(STORE_KEY, JSON.stringify(stored))
  } catch {
    /* 无痕模式等异常下静默跳过 */
  }
}

export function getUtm() {
  try {
    const q = new URLSearchParams(window.location.search)
    const stored = JSON.parse(sessionStorage.getItem(STORE_KEY) || '{}')
    const out = { ...stored }
    for (const k of UTM_KEYS) {
      const v = q.get(k)
      if (v) out[k] = v
    }
    return out
  } catch {
    return {}
  }
}
