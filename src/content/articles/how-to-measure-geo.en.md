---
title: How Do You Know If Your GEO Work Is Actually Working?
description: GEO has no official ranking table and no universal pass mark. What you can do is build a repeatable measurement under fixed conditions: the same questions, the same engines, the same cadence. Watch the trend, not single answers.
slug: how-to-measure-geo
date: 2026-10-26
language: en
author: RankGeo
---

## The question

Atomic Design's collection of Reddit questions includes one that cuts straight to the point: "How do I measure whether my GEO efforts are working?" (Atomic Design, updated July 2026). For a realtor, the question is more concrete: after spending time updating your website, adding content, and fixing directories, what number should you look at? Whether AI mentioned you on a given day is clearly not enough — AI wording varies from answer to answer, and a single result proves little.

## The core answer

There is no official GEO ranking table and no universal pass mark. What you can build is **repeated measurement under fixed conditions**: the same questions, the same engines, the same cadence — and then read the change. Watch the trend, not the single data point.

Three core metrics, defined first:

**1. Mention rate.** The share of answers in your fixed question set that mention you. Formula: mention rate = (answers mentioning you ÷ total valid answers) × 100%. For example, 12 mentions in 40 valid answers is a 30% mention rate — a description of that test sample, not your "true visibility" across all AI searches.

**2. Share of voice.** Your share of all realtor names mentioned. If competitors' names appear 100 times in a test round and yours appears 25 times, your share is 25%. It answers "how often do buyers hear your name in AI answers, relative to your peers" — which reflects the competitive picture better than mention rate alone.

**3. Description accuracy and cited sources.** Being mentioned is not enough: how does AI describe you? Are your service areas, languages, and brokerage affiliation correct? Did the answer cite your website, or only someone else's post about you? A wrong description needs fixing before a low mention rate does — a wrong description misleads buyers directly.

On "what counts as good," honesty is required: ranges published by individual firms (for example, mention rates of 15–25% as "good" and 30–50% as "great") are those firms' experience bands, not industry standards. Baselines differ entirely by city, question set, and engine. **The only reliable reference is your own baseline:** measure the current state first, then re-test monthly under identical conditions and read the relative change.

One more note on volatility. A Citepoint study from 2026 reported that the chance of two answers to the same prompt listing the same combination of brands was under one in a hundred (Citepoint, October 2026). That figure comes from a single study whose method details are not fully public, so it should not be treated as a universal law — but it points to a safe practice: **never draw conclusions from one or two answers. Sample size and repetition are what make a conclusion credible.**

Finally, an attribution boundary: if your mention rate rises while deals improve, that does not prove GEO caused the deals. Season, listings, and word of mouth may all be moving at the same time. Mention rate evidences a change in visibility inside AI answers, not a cause of sales.

## What to do

**1. Freeze a set of 10–20 buyer questions, half in English and half in Chinese.**
Questions should come from how buyers actually ask, not how you wish they asked. Examples: "Ottawa Chinese-speaking realtor for first-time buyers," "Kanata 卖房经纪推荐" (Kanata home-selling realtor recommendation), "渥太华买房经纪怎么选" (how to choose a home-buying realtor in Ottawa), "Barrhaven 新房经纪" (Barrhaven new-home realtor). Include both branded questions (naming you) and category questions (naming only the need) — the former tests brand recognition, the latter tests discovery.

**2. Run them monthly, on the same day, in fresh sessions, across 4 engines.**
ChatGPT, Perplexity, Gemini, and Google AI Overviews, each once per question. Always start a new conversation (citation rates fall as conversations go on), and log one table: question × engine → mentioned or not, position, sources cited, description accurate or not. One full round takes about 30–45 minutes; monthly is enough to start.

**3. Read the trend at 30 / 60 / 90 days, not on any single day.**
Month one is your baseline — no judgment yet. Month two shows direction. Month three shows which question types are improving and which are persistently absent. For the persistently absent ones, go back to their cited-source lists — that is the material to build next.

**4. Start free; buy a tool only when manual work costs more than the subscription.**
Free channels cover the start: Google Search Console for search performance, Bing Webmaster Tools for Copilot citation direction, and a GA4 segment for visits from chatgpt.com, perplexity.ai, and similar AI sources (note: this captures only visitors who clicked a link — people who saw you in an answer without clicking never appear in traffic). Consider a paid monitoring tool only when monthly manual testing takes more staff time than the subscription costs — a tool saves time, not conclusions.

**5. Treat description errors as the top priority.**
Mention rate can rise slowly, but AI getting your service area, language, or brokerage wrong misleads buyers immediately. Fix description errors first in each monthly review, then talk about mention rate.

## Sources

- Atomic Design, "GEO Questions from Reddit, Answered," updated July 2026: http://atomicdesign.net/answers/generative-engine-optimization/
- Reaudit, "GEO Metrics: 11 KPIs for AI Search Visibility," October 2026 (mention-rate and share-of-voice definitions): https://reaudit.io/blog/geo-metrics-kpis-measure-ai-search-visibility
- Margen, "How to Measure Your AI Search Visibility: The Complete Guide," 2026 (manual monitoring routine and free-tool combination): https://www.margen.net/how-to-measure-ai-search-visibility-complete-guide/
- Proof Digital, "How to Monitor AI Search Visibility for Free in 2026," September 2026 (each free tool's blind spot): https://proofdigital.com/blog/free-ai-search-geo-monitoring-tools/
- Citepoint, "How ChatGPT Search Works (and Why Its Answers Differ)," October 2026 (repeat-brand-combination rate for the same prompt): https://pages.citepoint.ai/articles/how-chatgpt-search-works
