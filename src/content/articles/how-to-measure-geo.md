---
title: 做了 GEO，怎么才算知道有没有效果？
description: GEO 没有官方排名表，也没有统一的及格线。能做的，是给自己建一套固定条件下的重复测量：同一组问题、同一批引擎、同一个节奏，记录变化。看趋势，不看单点。
slug: how-to-measure-geo
date: 2026-10-26
language: zh
author: RankGeo
---

## 问题背景

Atomic Design 整理的 Reddit 高频问题里，有一问直指痛点："How do I measure whether my GEO efforts are working?"（Atomic Design，2026 年 7 月更新）。对经纪来说，这个问题更具体：花了时间改网站、补内容、做名录，到底该看什么数字？看 AI 某天提没提到自己，显然不够——AI 的回答每次措辞都可能不同，单次结果说明不了什么。

## 核心回答

GEO 没有官方排名表，也没有统一的"及格线"。能做的，是给自己建一套**固定条件下的重复测量**：同一组问题、同一批引擎、同一个节奏，记录变化。看趋势，不看单点。

三个核心指标，定义先说清楚：

**1. 提及率（mention rate）。** 在固定问题组里，你被提到的回答占比。公式：提及率 =（提到你的回答数 ÷ 有效回答总数）× 100%。例如 40 次有效回答里提到你 12 次，提及率就是 30%——描述的是这次测试样本，不是你在全网 AI 搜索里的"真实可见度"。

**2. 份额（share of voice）。** 在所有被提到的经纪名字里，你占的比例。如果一轮测试里竞争对手名字共出现 100 次、你出现 25 次，你的份额就是 25%。它回答的是"在 AI 的答案里，买家听到你的频率相对同行如何"，比单纯的提及率更能反映竞争格局。

**3. 表述准确性与引用来源。** 被提到还不够：AI 是怎么描述你的？服务区域、语言、公司归属写对了吗？答案引用了你的网站，还是只引用了别人写你的帖子？描述错误比没被提到更需要优先处理——错误的描述会直接影响买家判断。

关于"多少算好"，要诚实地说：市面上的区间（例如某些机构给出的提及率 15–25% 算"不错"、30–50% 算"很好"）只是个别机构的经验区间，不是行业标准。不同城市、不同问题组、不同引擎的基数完全不同。**唯一可靠的参照是你自己的基线**：先测一次现状，之后每月在同样条件下复测，看相对变化。

还有一个关于波动的提醒。Citepoint 2026 年的研究报告称，同一问题两次回答列出相同品牌组合的概率低于百分之一（Citepoint，2026 年 10 月）。这个数字本身来自单项研究、方法细节未完全公开，不能当作普遍定律；但它指向一个稳妥的做法：**永远不要凭一两次回答下结论，样本量和重复次数就是结论可信度的来源。**

最后是归因边界：提及率上升的同时成交变好，不能直接说成是 GEO 带来的成交。两者可能同时受到季节、房源、口碑等其他因素影响。提及率能证明的是"AI 答案里的可见度变化"，不是"成交原因"。

## 实操建议

**1. 冻结一组 10–20 个买家问题，中英各半。**
问题要来自买家真实问法，而不是你希望被问到的问法。例如："Ottawa Chinese-speaking realtor for first-time buyers""Kanata 卖房经纪推荐""渥太华买房经纪怎么选""Barrhaven 新房经纪"。品牌词问题（直接问你名字）和品类词问题（不问名字、只问需求）都要有——前者测品牌认知，后者测获客能力。

**2. 每月同一天、用新会话、在 4 个引擎里跑一遍。**
ChatGPT、Perplexity、Gemini、Google AI Overviews 各跑一次同一组问题。每次都开新对话（避免对话轮次影响引用率），记录一张表：问题 × 引擎 → 是否提到你、排第几、引用了哪些来源、描述是否准确。一次完整测试约 30–45 分钟，每月一次即可起步。

**3. 30 / 60 / 90 天读趋势，不读单日。**
第一个月是基线，不做判断；第二个月看有没有方向；第三个月再判断哪类问题在改善、哪类始终缺席。始终缺席的那类问题，回去查它的引用来源清单——那就是下一轮要补的材料。

**4. 免费工具先起步，工具等到手动成本超过订阅再买。**
起步阶段免费渠道已够用：Google Search Console 看搜索表现、Bing Webmaster Tools 看 Copilot 引用方向、GA4 里单独看来自 chatgpt.com、perplexity.ai 等 AI 来源的访问（注意：这只是"点了链接来的"那部分，没点链接、只在答案里看到你的，不会出现在流量里）。等每月手动测试耗时超过工具订阅成本时，再考虑付费监测工具——工具省的是时间，不是结论。

**5. 把"描述错误"设为最高优先级。**
提及率可以慢慢涨，但 AI 把你的服务区域、语言或公司归属写错，是立刻会误导买家的。每月复测时先修描述错误，再谈提及率。

## 数据来源

- Atomic Design，《GEO Questions from Reddit, Answered》，2026 年 7 月更新：http://atomicdesign.net/answers/generative-engine-optimization/
- Reaudit，《GEO Metrics: 11 KPIs for AI Search Visibility》，2026 年 10 月（提及率、份额定义）：https://reaudit.io/blog/geo-metrics-kpis-measure-ai-search-visibility
- Margen，《How to Measure Your AI Search Visibility: The Complete Guide》，2026 年（手动监测流程与免费工具组合）：https://www.margen.net/how-to-measure-ai-search-visibility-complete-guide/
- Proof Digital，《How to Monitor AI Search Visibility for Free in 2026》，2026 年 9 月（免费工具各自的盲点）：https://proofdigital.com/blog/free-ai-search-geo-monitoring-tools/
- Citepoint，《How ChatGPT Search Works (and Why Its Answers Differ)》，2026 年 10 月（同一问题两次回答品牌组合重复率）：https://pages.citepoint.ai/articles/how-chatgpt-search-works
