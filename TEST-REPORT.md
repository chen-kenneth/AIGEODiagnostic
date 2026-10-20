# RankGeo 改版 — 源码审核修复报告（2026-10-12 第二轮）

针对源码审核意见的逐项修复与测试结果。未合并 main，未改变技术架构。

## P0 修复

### 1. `src/main.jsx`：createRoot → hydrateRoot
- 预渲染 HTML 现由 `hydrateRoot` 接管，不再丢弃静态 DOM 重渲染。
- **Hydration 测试**（Playwright，真浏览器，8 路由逐个加载并监听 console）：
  - `/`、`/en/`、`/articles/`、`/privacy/`、`/en/privacy/`、
    `/articles/ai-visibility-test-methodology/`、`/articles/geo-vs-seo/`、
    `/articles/why-ottawa-chinese-realtors-invisible-in-ai/`
  - **结果：8/8 无 hydration 警告、无 console error**；每页 h1 与预渲染内容一致，
    确认客户端首次渲染与服务端输出一致。

### 2. `src/components/CTAForm.jsx`：改用 `new FormData(form)`
- 消除 `form.name.value` 这类具名表单字段访问的不可靠性；蜜罐检查同步改为 `fd.get('website2')`。
- **表单测试**（Playwright + 请求拦截 `https://formspree.io/f/<id>`，使用临时测试 ID；交付源码中已恢复为空）：
  - 成功路径：请求发往正确 URL；payload 字段完整
    `name / email / website / city（默认渥太华）/ languageFocus（both）/ utm_source / utm_medium`；
    提交后显示成功态 ✅
  - 失败路径：请求 abort 时显示明确报错 ✅（不再静默失败）
  - 字段完整性：必填 name/email 缺失时浏览器原生校验拦截 ✅

## 其他修复

### 3. ACCEPTANCE.md 拼写
- `rankgo.ca` → `rankgeo.ca` ✅

### 4. 不存在的 URL 返回真实 HTTP 404
- 仓库无 `vercel.json`、无 rewrite/redirect 规则 → Vercel 静态托管对未知路径返回原生 404，
  不会 fallback 到 SPA；App.jsx 内的 React 404 路由仅作兜底（生产环境直接命中时不会被触发）。
- 最终确认列在验收清单中，请在 Preview 部署上用 `curl -I https://<preview>/nope` 验证。

### 5. UTM 归因持久化（新增 `src/lib/attribution.js`）
- `main.jsx` 加载时 `persistUtm()` 把落地页 UTM 写入 `sessionStorage`；
  表单提交时 `getUtm()` 合并 sessionStorage + 当前 URL 参数。
- **测试**：`/?utm_source=wechat&utm_campaign=spring` 落地 → 跳转 `/articles/` 后
  sessionStorage 仍为 `{"utm_source":"wechat","utm_campaign":"spring"}` ✅；
  表单 payload 携带 utm 字段 ✅。

### 6. 方法论文章措辞
- "48 个真实买家查询" → "48 个模拟买家查询"（标题、描述、正文、realtors.js、llms.txt 全站统一）；
  方法论文章明确标注"非真实用户提问日志，而是按买家视角人工设计的典型问法"。
- 删除 B2B→购房者推断句（"买房金额更大所以更自然"那句），改为"不宜直接推断购房者行为"。

### 7. 完整构建测试
- `npm run build`：8 路由预渲染成功（19.2KB 首页 / 25.7KB 英文页等）。
- 静态检查：8 个 HTML 全部含 canonical、无 `<!--HEAD-->` 残留、无空 `#root`；
  JSON-LD 全部合法（ProfessionalService/FAQPage/Article/CollectionPage/WebPage）；
  sitemap 8 个 URL；robots 含 OAI-SearchBot/PerplexityBot/ClaudeBot/GPTBot + Sitemap 声明；llms.txt 正常。
- hreflang：`/`↔`/en`、`/privacy`↔`/en/privacy` 配对 + x-default；文章页（仅中文）不虚构配对。
- 浏览器交互：语言切换 `/`→`/en`→`/` 正常；移动端（390px）Hero 正常堆叠。

## 本次修改文件清单
- `src/main.jsx`（hydrateRoot + persistUtm）
- `src/lib/attribution.js`（新增）
- `src/components/CTAForm.jsx`（FormData + 归因库）
- `src/components/Nav.jsx`（非首页 CTA 跨页锚点修正）
- `src/content/realtors.js`（模拟买家查询措辞）
- `src/content/articles/ai-visibility-test-methodology.md`（模拟标注 + 去推断）
- `public/llms.txt`（模拟买家查询措辞）
- `ACCEPTANCE.md`（拼写修正）

## 待 Tan 做的（不变）
1. `src/config.js` 填 Formspree ID；2. Plausible 注册；3. 新分支 PR → Preview 验收 → 合 main。

---

# 第三轮针对性修复（2026-10-12 晚）

## 修改文件清单（共 3 个）
- `src/content/realtors.js`
- `package.json`
- `scripts/prerender.mjs`

## 关键 diff

### 1. 营销文案去绝对化（realtors.js，中英）
- `买房是人生最大的一笔消费——买家问 AI 之前，不会先看你的广告。`
  → `买房是人生最大的一笔消费，越来越多买家在做决定前会先问 AI。`
- `不在答案里，就等于不存在。` → `不在答案里，就错过了被看见的机会。`
- `如果 AI 的回答里没有你，买家根本不会知道你的存在。` → `如果 AI 的回答里没有你，你就少了一次被看见的机会。`
- EN: `buyers ask AI before they ever see your ads.` → `more and more buyers ask AI before making a decision.`
- EN: `Being visible in one AI means being invisible in the others.` → `Visibility in one engine does not carry over to the others.`
- EN: `If AI's answer doesn't include you, buyers won't know you exist.` → `If AI's answer doesn't include you, you miss a chance to be seen.`

### 2. 报告样例统一为"模拟/示意"（realtors.js，中英）
- `真实的检测报告，长这样` → `检测报告，长这样` / `This is what a real visibility report looks like` → `What your visibility report looks like`
- `以下为示意报告（数据经脱敏处理）` → `以下为模拟报告（示意数据）` / `(anonymized data)` → `(simulated data)`
- `部分查询实测摘录（示意）` → `部分查询摘录（示意数据）`
- `48 real buyer queries` → `48 simulated buyer queries`（3 处）；`真实查询实测` → `实测而非估计`

### 3. 英文导航标注（realtors.js）
- EN nav / footer: `Blog` → `Blog (中文)`，英文访客不再误以为有英文版

### 4. 构建去重（package.json）
- `build: vite build && node scripts/prerender.mjs` → `build: node scripts/prerender.mjs`
  （prerender.mjs 内部已执行一次 vite build；新增 `build:client` 供单独客户端构建）

### 5. sitemap lastmod（scripts/prerender.mjs）
- 删除写死的 `TODAY`；改为按路由取内容源文件 mtime：
  `/`、`/en` 取 realtors.js/articles/components 的最大 mtime；文章页取对应 md 文件 mtime；privacy 取 Privacy.jsx mtime
- 验证：把某文章 md 时间改为 2026-09-01 后重建，该 URL lastmod 变为 2026-09-01，其余保持 2026-10-12 ✅

## 测试结果（真实执行）
- 构建：`npm run build` 一次通过，8 路由预渲染成功（vite build 只运行一次）
- Hydration：真浏览器 8/8 路由零警告
- 表单：成功（字段齐全 name/email/website/city/languageFocus）✅ / 蜜罐（无请求发出，显示成功态）✅ / 失败（显示报错）✅
- SEO：8 页各 1 个 h1；canonical 全有；hreflang 首页配对正常、文章页无虚构配对；JSON-LD 全合法；8 页全文扫描无绝对化/旧标签残留；robots/sitemap/llms.txt 正常
- Logo：桌面中英 + 移动端中英截图验收，白色胶囊尺寸正常，移动端无溢出
- EN 导航显示 `Blog (中文)` ✅

---

# 第四轮：上线前最后调整（2026-10-12）

## 修改文件（2 个）
- `src/content/realtors.js`
- `scripts/prerender.mjs`（仅加 TODO 注释）

## 改动
1. 绝对化文案软化（中英一致）：
   - `只被一个 AI 看见，等于被其他 AI 忽略。` → `只在一个引擎里被看见，不代表其他引擎也会提及你。`
   - `如果它在网上认不出你，回答里就不会有你。` → `如果它在网上很少遇到你，被写进回答的机会就小得多。`
   - EN: `If it can't recognize you online, you won't be in the answer.` → `If it rarely encounters you online, your chances of being included are much lower.`
2. 删除无数据支持的推断：`买房是人生最大的一笔消费，越来越多买家在做决定前会先问 AI。` → `买房是人生最大的一笔消费。`（EN 同理；NAR 2026 数据只有经纪人侧 AI 使用率，无购房者侧数据，故删除不断言）
3. FAQ 新增（中英各 1 条）："免费 AI 可见度检测包含什么？多久能收到？"——明确人工运行精简版扫描、2 个工作日内邮件发送、与完整版（48 查询×4 引擎+竞争对比+每月复测）的范围区别
4. sitemap lastmod 沿用文件 mtime 方式（加 TODO 注释，未来改内容日期字段，不阻塞部署）

## 测试结果
- 构建：一次通过，8 路由 ✅
- Hydration：8/8 零警告 ✅
- SEO：canonical/hreflang/JSON-LD 正常；新 FAQ 已进 HTML 与 FAQPage schema；旧绝对化文案 8 页全文扫描零残留（中英）✅
- 表单：提交成功态 ✅（真实 Formspree ID 待 Tan 配置后复测）
- 移动端 390px：无横向溢出 ✅
- 待 Tan：Formspree ID、Plausible 注册——这两项通过前不合并 main

---

# 第五轮：页脚 + 导航栏 logo 更换（2026-10-12）

## 改动文件
- `public/logo-footer-dark.png`（新增，Tan 提供的白字版页脚 logo，裁边 + 1000px/269KB）
- `public/rankgeo-navbar-dark.svg` / `public/rankgeo-navbar-light.svg`（新增，Tan 提供；内嵌 base64 PNG 的 SVG wrapper，1681×321）
- `src/components/Footer.jsx`：去掉白色胶囊，新 logo 直接放深色页脚
- `src/components/Nav.jsx`：去掉白色胶囊，中英统一用 dark 版 SVG；logo 链接回对应语言首页，aria-label="RankGeo.ca"
- `src/App.css`：页脚 logo 桌面 58px / 手机 44px；导航 logo 桌面 46px / 手机 32px

## 测试
- 桌面 + 手机截图：导航栏/页脚显示正常，无溢出，无白胶囊
- 中英切换：/ ↔ /en、/privacy ↔ /en/privacy、/articles 点 EN 保持不动、logo 回对应首页，桌面+手机全过
- hydration 8/8 零警告（注：本地 vite preview 对无斜杠 URL 有 SPA fallback 假象，生产 Vercel clean URLs 不受影响）
- Hero/CTA/页面结构未动
