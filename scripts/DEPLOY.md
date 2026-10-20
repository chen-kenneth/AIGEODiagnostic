# RankGeo 网站改版 — 部署说明（给 Tan）

> 基线保护：线上正式站 = GitHub `main` 分支当前状态。**不要直接往 main 推改版代码。**
> 流程：新分支 → push → GitHub 开 PR → Vercel 自动生成 Preview 链接 → 按验收清单检查 → 通过后才合并 main。

## 0. 上线前必须做的 2 件事（各约 2 分钟）

1. **表单接入**：去 https://formspree.io 免费注册 → New Form → 把得到的 ID（形如 `xabcdwxyz`）
   填进 `src/config.js` 的 `formspreeId`。不填的话表单会明确提示"未接入"，不会假装提交成功。
2. **统计账号**：去 https://plausible.io 注册并添加域名 `rankgeo.ca`（按页面指引验证即可，
   代码里已埋好统计脚本）。

## 1. 发布改版（Preview 验收流程）

```bash
cd AIGEODiagnostic-main
git checkout -b redesign-2026-10
git add -A
git commit -m "RankGeo 改版：预渲染 + 双语路由 + 文章系统 + 科技风视觉"
git push -u origin redesign-2026-10
```

然后去 GitHub 仓库点 **Compare & pull request** → Vercel 会自动在 PR 下生成
**Preview** 预览链接 → 按下面的验收清单逐项检查 → 全部通过后点 **Merge**，
Vercel 自动部署到 rankgeo.ca 正式站。

## 2. 发布后

- 去 Google Search Console 提交 `https://www.rankgeo.ca/sitemap.xml`
- 去 Bing Webmaster Tools 同样提交一次
- 用验收清单第 5 步的方法抽查线上 HTML

## 3. 以后发新文章

1. 在 `src/content/articles/` 新建 `my-slug.md`（照抄已有文章的 frontmatter 格式）
2. `npm run build` 本地验证 → 提交 → 走上面的 PR 流程
3. 文章页、列表页、sitemap、llms.txt 会自动更新

## 4. 回滚

如正式站出问题：Vercel → Deployments → 找到上一个稳定部署 → 点 **Promote to Production**。
