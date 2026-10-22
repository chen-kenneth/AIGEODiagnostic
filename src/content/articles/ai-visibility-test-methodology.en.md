---
title: AI Visibility Test Methodology: 48 Queries in 4 AI Engines
description: How RankGeo's AI visibility test works: 48 simulated buyer queries, 4 AI engines, how mention rate is calculated — and what this method can't measure.
slug: ai-visibility-test-methodology
date: 2026-10-12
language: en
author: RankGeo
---

"When a buyer asks AI 'recommend a Chinese-speaking realtor in Canada,' will your name appear?"

You can't answer that by gut feeling. AI recommendation lists aren't published, there's no rankings page to check, and asking the same question twice can yield different answers. Answering it requires a repeatable testing method. Below is our methodology for AI visibility testing: how it's designed, and where its limits are.

## 1. 48 Simulated Queries: Starting From "How Buyers Actually Ask"

The test starts not from "how realtors wish to be searched," but from "how buyers actually ask." We designed 48 simulated buyer queries (not real user query logs, but typical phrasings crafted from the buyer's perspective), covering the main question types buyers ask when looking for a realtor:

- **Direct recommendations**: "Chinese-speaking realtor in Canada recommendation," "Canada Chinese speaking realtor recommendation"
- **Transaction scenarios**: "what kind of realtor should I find to sell," "first time home buyer Toronto realtor"
- **Comparison shopping**: "buying in Canada — Chinese-speaking realtor or local realtor?"
- **City × language combinations**: Toronto, Vancouver, Calgary and other cities, each asked in both Chinese and English

Chinese and English each make up half. Chinese buyers in Canada use both languages — testing only one would miss the real picture in the other language.

## 2. Why 4 AI Engines

We run these 48 queries on ChatGPT, Perplexity, Gemini, and Claude — 192 answers in total.

Four instead of one because citation preferences differ dramatically across engines. An analysis of 3.7 million AI citations found that 91% appeared in only one of ChatGPT, Perplexity, or Google AI Overviews; only 2.37% of URLs were cited by all three for the same question (Kevin Indig / [Growth Memo, May 2026](https://www.growth-memo.com/p/the-consensus-gap)). Performing well in one engine doesn't mean you exist in the others — and buyers use all kinds of tools.

## 3. Mention Rate: How It's Calculated and Read

The core metric is "mention rate": the number of answers mentioning a given realtor, divided by total answers.

A single total isn't enough — we break it into three dimensions: **by engine** (e.g., appearing in 5 of 12 ChatGPT answers but 0 in Perplexity — such gaps are common), **by language** (Chinese-query and English-query performance often differ completely), and **head-to-head** (testing you alongside key competitors on the same query set).

One anonymized example: in one test round, a realtor's total mention rate was about 10%, all from ChatGPT, with zero mentions across the other three engines — while the top performer in the same round reached about 65%. The gap is usually not "whether you have a website," but whether AI "knows" you.

## 4. This Method's Limits (Must Be Stated)

1. **Single snapshot**: Models update weekly and knowledge bases shift. Today's test only reflects "right now."
2. **Answer variance**: Ask the same question twice and the AI may answer differently. We fix the phrasing, record timestamps, and rely on regular re-testing for trends — never treating one run as conclusive.
3. **Sampling, not census**: 48 queries simulate typical buyer perspectives; they can't cover every phrasing.
4. **Testing doesn't promise improvement**: Testing tells you your starting point and gaps. It doesn't guarantee mention rates will rise after optimization — that depends on execution quality and sustained effort.

## 5. What Comes After the Test

A test's value is twofold: knowing your true position in AI's eyes, and getting a baseline you can re-test against. We recommend re-running the same query set monthly and judging direction by trend, not by any single number.

Forrester's *2026 Buyers' Journey Survey* (about 18,000 global enterprise buyers) found 94% used generative AI in their most recent purchase process, up from 89% the year before. Note: that's B2B purchasing data — it doesn't transfer directly to home-buying, and serves only as industry context that "ask AI before deciding" has become mainstream behavior, not as a basis for inferring homebuyer behavior. Knowing how AI sees you is the first step.
