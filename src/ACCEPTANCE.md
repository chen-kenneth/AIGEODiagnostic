# RankGeo 改版验收清单（Preview 链接上逐项检查）

## 1. 预渲染 / 无 JS 内容（P0）
- [ ] `curl https://<preview>/` 的 HTML 里直接能看到中文主标题"当客户问 AI 推荐哪位地产经纪时"
- [ ] `curl https://<preview>/en/` 的 HTML 里是英文主标题"When buyers ask AI…"
- [ ] `/articles/` 与每篇 `/articles/<slug>/` 返回 200 且含正文
- [ ] 不存在的路由（如 `/nope`）返回 404

## 2. 双语与元数据
- [ ] 中文页 `<html lang="zh-Hans-CN">`，英文页 `<html lang="en-CA">`
- [ ] 中文页有 `hreflang="zh-Hans-CN"` + `hreflang="en-CA"` + `x-default`，英文页镜像正确
- [ ] 每页 title / meta description / OG 标签与语言一致
- [ ] JSON-LD：首页有 ProfessionalService + FAQPage（FAQ 文案与页面可见问答逐字一致）；
      文章页有 Article（含作者、日期）

## 3. 站点文件
- [ ] `https://<preview>/robots.txt` 可访问，含 OAI-SearchBot / PerplexityBot / ClaudeBot 等
- [ ] `https://<preview>/sitemap.xml` 可访问，URL 无 404、无非 www/www 混用
- [ ] `https://<preview>/llms.txt` 可访问

## 4. 文案与信任
- [ ] 全站无"确保/保证 AI 推荐"类措辞（FAQ 里"能保证 AI 推荐我吗"回答为"不能"）
- [ ] "为什么重要"三组数字带来源与适用范围说明
- [ ] AI 问答演示卡明确标注"模拟演示"
- [ ] 脱敏报告样例标注"示意数据"

## 5. 转化
- [ ] 表单：填入 Formspree ID 后真实提交成功（去 Formspree 后台查收）；提交失败有明确报错；
      不填 ID 时显示"未接入"提示而非假成功
- [ ] Plausible 统计能收到访问数据

## 6. 视觉与体验
- [ ] 深色 Hero 在手机/桌面都正常，无文字重叠
- [ ] 语言切换按钮：中文页点 EN 跳 `/en`，英文页点中文跳 `/`
- [ ] 全站无横向滚动条，图片正常加载

## 7. 线上复测（合并 main 后）
- [ ] rankgeo.ca 首页 HTML 含中文正文；`/en/` 含英文正文
- [ ] Search Console / Bing 已提交 sitemap
