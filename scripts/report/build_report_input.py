#!/usr/bin/env python3
"""
build_report_input.py
---------------------
Converts chatgpt_results.json → report_input.json (ready for generate_report.py).

Derives real stats from the actual query results:
  - Client appearance rate vs. top competitor
  - Per-query appeared/rank
  - Competitor leaderboard

Usage:
  python build_report_input.py
  python build_report_input.py --results chatgpt_results.json --out report_input.json
"""

import argparse
import json
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path


# ── Loaders ────────────────────────────────────────────────────────────────────

def load(path: str) -> dict | list:
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        sys.exit(f"Error: file not found — {path}")
    except json.JSONDecodeError as e:
        sys.exit(f"Error: invalid JSON in {path}\n{e}")


# ── Stats derivation ────────────────────────────────────────────────────────────

def compute_stats(results: list[dict], client_names: list[str]) -> dict:
    """
    From a list of query result objects, compute:
      - client_rate: % of queries where any client name appeared
      - competitor_rates: {name: pct} for all non-client tracked names
      - top_competitor: name with highest appearance rate
      - top_queries_tested: list in report schema format
    """
    total = len(results)
    if total == 0:
        return {}

    valid_results = [r for r in results if not r.get("error")]
    total_valid = len(valid_results)
    failed_queries = total - total_valid
    if total_valid == 0:
        return {
            "client_rate": 0,
            "competitor_rates": {},
            "top_competitor": None,
            "top_competitor_rate": 0,
            "top_queries_tested": [],
            "total_queries": total,
            "valid_queries": 0,
            "failed_queries": failed_queries,
        }

    # Count appearances per name across all queries
    appearance_counts: dict[str, int] = defaultdict(int)
    # Track first rank when appeared, for averaging
    rank_sum: dict[str, int] = defaultdict(int)

    top_queries_tested = []

    for r in valid_results:
        mentioned_names = {m["name"] for m in r.get("tracked_mentions", [])}
        mention_rank = {m["name"]: m["rank"] for m in r.get("tracked_mentions", [])}

        for name in mentioned_names:
            appearance_counts[name] += 1
            rank_sum[name] += mention_rank[name]

        # Did any client name appear?
        client_mentions = [m for m in r.get("tracked_mentions", [])
                           if m["name"] in client_names]
        client_appeared = len(client_mentions) > 0
        client_rank = client_mentions[0]["rank"] if client_appeared else None

        if r.get("include_in_sample_report", True):
            top_queries_tested.append({
                "query": r["query"],
                "appeared": client_appeared,
                "rank": client_rank,
            })

    # Rates as percentages (0–100)
    def rate(name):
        return round(appearance_counts[name] / total_valid * 100)

    # Client overall rate: appeared in at least one client name per query
    client_query_hits = sum(
        1 for r in valid_results
        if any(m["name"] in client_names for m in r.get("tracked_mentions", []))
    )
    client_rate = round(client_query_hits / total_valid * 100)

    # All tracked non-client names
    competitor_names = [
        name for name in appearance_counts
        if name not in client_names
    ]
    competitor_rates = {name: rate(name) for name in competitor_names}

    top_competitor = max(competitor_rates, key=competitor_rates.get) if competitor_rates else None
    top_rate = competitor_rates[top_competitor] if top_competitor else 0

    return {
        "client_rate": client_rate,
        "competitor_rates": competitor_rates,
        "top_competitor": top_competitor,
        "top_competitor_rate": top_rate,
        "top_queries_tested": top_queries_tested,
        "total_queries": total,
        "valid_queries": total_valid,
        "failed_queries": failed_queries,
    }


def score_label(score: int) -> str:
    if score >= 60:
        return "Strong"
    if score >= 35:
        return "Fair"
    return "Needs Improvement"


def score_color(score: int) -> str:
    if score >= 60:
        return "green"
    if score >= 35:
        return "orange"
    return "red"


# ── Report input builder ────────────────────────────────────────────────────────

def build_report_input(results: list[dict], cfg: dict) -> dict:
    client_names = cfg.get("client_names", [])
    client_display = " / ".join(client_names)
    stats = compute_stats(results, client_names)

    you = stats["client_rate"]
    top = stats["top_competitor_rate"]
    top_name = stats["top_competitor"] or "Unknown"
    gap = top - you

    # Market average: mean of all tracked competitor rates
    comp_rates = list(stats["competitor_rates"].values())
    market_avg = round(sum(comp_rates) / len(comp_rates)) if comp_rates else top

    total_q = stats["total_queries"]
    valid_q = stats.get("valid_queries", total_q)
    failed_q = stats.get("failed_queries", 0)
    label = score_label(you)
    color = score_color(you)

    if gap > 0:
        headline = (
            f"You appeared in {you}% of AI queries — "
            f"your top competitor ({top_name}) appeared in {top}%."
        )
        opportunity = (
            f"There is a {gap}-point gap between you and {top_name}. "
            f"Results are based on {valid_q} successful test queries run through ChatGPT"
            f" ({failed_q} failed)."
        )
    else:
        headline = f"You appeared in {you}% of AI queries — matching or beating tracked competitors."
        opportunity = (
            f"Results are based on {valid_q} successful test queries run through ChatGPT"
            f" ({failed_q} failed)."
        )

    # Build competitor leaderboard (top 3)
    sorted_comps = sorted(
        stats["competitor_rates"].items(), key=lambda x: x[1], reverse=True
    )
    top3_comps = sorted_comps[:3]
    comp_lines = ", ".join(f"{n} ({r}%)" for n, r in top3_comps)

    competitor_breakdown = [
        {"name": name, "score": rate, "max": 100}
        for name, rate in top3_comps
    ]

    return {
        "meta": {
            "report_date": date.today().isoformat(),
            "prepared_by": "RankGeo",
            "client_name": client_display,
            "client_title": "Ottawa Realtor",
            "client_website": "",
            "language": "en",
        },
        "summary": {
            "overall_score": you,
            "score_label": label,
            "score_color": color,
            "headline": headline,
            "opportunity": opportunity,
        },
        "visibility_scores": {
            "description": (
                f"How often you were recommended across {total_q} test queries "
                f"run through ChatGPT ({cfg.get('model', 'gpt-4o')}); "
                f"scores use {valid_q} successful responses."
            ),
            "you": you,
            "market_avg": market_avg,
            "top_competitor": top,
            "top_competitor_name": top_name,
        },
        "competitor_breakdown": competitor_breakdown,
        "platform_breakdown": [
            {
                "platform": "ChatGPT",
                "your_score": you,
                "competitor_score": top,
                "max": 100,
            }
        ],
        "language_breakdown": [],
        "signal_scores": [],
        "top_queries_tested": stats["top_queries_tested"],
        "recommendations": _build_recommendations(you, top_name, top, comp_lines),
        "next_steps": {
            "cta_label": "Ready to improve your AI visibility?",
            "cta_url": "https://rankgeo.ca/#cta-form",
            "contact_email": "hello@rankgeo.ca",
        },
    }


def _build_recommendations(you: int, top_name: str, top: int, comp_lines: str) -> list[dict]:
    recs = []
    if you == 0:
        recs.append({
            "priority": "High",
            "title": "Establish a traceable online presence",
            "detail": (
                "ChatGPT did not mention you in any tested queries. "
                "This typically means your name does not appear in enough "
                "indexed web content. Start by ensuring your profiles on "
                "Realtor.ca, LinkedIn, and Google Business are complete and consistent."
            ),
        })
    if top > you + 20:
        recs.append({
            "priority": "High",
            "title": f"Close the gap with {top_name}",
            "detail": (
                f"{top_name} appeared in {top}% of queries vs your {you}%. "
                "Analyze where they are mentioned (directories, news, reviews) "
                "and mirror those citation sources."
            ),
        })
    recs.append({
        "priority": "High",
        "title": "Build English-language citations",
        "detail": (
            "Get listed and mentioned in at least 10 English-language directories, "
            "local news sources, and real estate blogs. "
            "This is the single biggest driver of English AI visibility."
        ),
    })
    recs.append({
        "priority": "Medium",
        "title": "Add a dedicated specialty page to your website",
        "detail": (
            "Create a page that clearly states your Chinese-speaking buyer expertise, "
            "Ottawa focus, and past client results. "
            "AI tools pull from website content to verify specialization."
        ),
    })
    recs.append({
        "priority": "Medium",
        "title": "Request and publish client reviews in English",
        "detail": (
            "Reviews on Google Business and Realtor.ca that mention your specialty "
            "help AI tools confirm your expertise. Aim for 5+ new English-language reviews."
        ),
    })
    recs.append({
        "priority": "Low",
        "title": "Publish bilingual market commentary",
        "detail": (
            "Short monthly posts in both English and Chinese about Ottawa market trends "
            "create fresh, keyword-rich content that AI tools index and cite."
        ),
    })
    return recs


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Convert chatgpt_results.json → report_input.json"
    )
    parser.add_argument("--results", default="outputs/chatgpt_results.json",
                        help="Query results file (default: outputs/chatgpt_results.json)")
    parser.add_argument("--config", default="query_config.json",
                        help="Query config file (default: query_config.json)")
    parser.add_argument("--out", "-o", default="outputs/report_input.json",
                        help="Output file (default: outputs/report_input.json)")
    args = parser.parse_args()

    results = load(args.results)
    cfg = load(args.config)

    report_input = build_report_input(results, cfg)

    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(report_input, f, indent=2, ensure_ascii=False)

    print(f"Report input written → {args.out}")
    print(f"\nClient appearance rate : {report_input['visibility_scores']['you']}%")
    print(f"Top competitor         : {report_input['visibility_scores']['top_competitor_name']} "
          f"({report_input['visibility_scores']['top_competitor']}%)")
    print(f"\nNext: python generate_report.py {args.out}")


if __name__ == "__main__":
    main()
