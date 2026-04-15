#!/usr/bin/env python3
"""
generate_report.py
------------------
RankGeo — AI Visibility Report Generator

Usage:
  python generate_report.py input.json
  python generate_report.py input.json --pdf          # also export PDF (requires weasyprint)
  python generate_report.py input.json --out my_report.html

Requires: Python 3.8+
Optional PDF: pip install weasyprint
"""

import argparse
import json
import math
import os
import sys
from datetime import datetime
from pathlib import Path
from string import Template


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────

def load_json(path: str) -> dict:
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        sys.exit(f"Error: file not found — {path}")
    except json.JSONDecodeError as e:
        sys.exit(f"Error: invalid JSON in {path}\n{e}")


def score_color(score: int) -> str:
    """Return a CSS class name based on score value."""
    if score >= 60:
        return "good"
    if score >= 35:
        return "fair"
    return "weak"


def score_label(score: int) -> str:
    if score >= 60:
        return "Strong"
    if score >= 35:
        return "Fair"
    return "Needs Work"


def bar_width(value: int, maximum: int = 100) -> int:
    """Clamp to [0, 100] percent."""
    return max(0, min(100, round(value / maximum * 100)))


def priority_class(p: str) -> str:
    return {"High": "priority-high", "Medium": "priority-medium", "Low": "priority-low"}.get(p, "")


def appeared_badge(appeared: bool, rank) -> str:
    if appeared and rank:
        return f'<span class="badge badge-yes">#{rank} Appeared</span>'
    return '<span class="badge badge-no">Not Mentioned</span>'


def format_date(iso_date: str) -> str:
    try:
        return datetime.strptime(iso_date, "%Y-%m-%d").strftime("%B %d, %Y")
    except ValueError:
        return iso_date


# ──────────────────────────────────────────────
# Section builders — each returns an HTML string
# ──────────────────────────────────────────────

def build_header(data: dict) -> str:
    meta = data["meta"]
    summary = data["summary"]
    date_str = format_date(meta["report_date"])
    overall = summary["overall_score"]
    color_cls = score_color(overall)
    return f"""
<header class="report-header">
  <div class="header-top">
    <div class="brand">Rank<span>Geo</span>.ca</div>
    <div class="report-meta">
      <div class="meta-item"><span class="meta-label">Prepared for</span><strong>{meta['client_name']}</strong></div>
      <div class="meta-item"><span class="meta-label">Title</span>{meta['client_title']}</div>
      <div class="meta-item"><span class="meta-label">Website</span><a href="{meta['client_website']}">{meta['client_website']}</a></div>
      <div class="meta-item"><span class="meta-label">Report date</span>{date_str}</div>
    </div>
  </div>
  <div class="summary-banner">
    <div class="score-circle {color_cls}">
      <div class="score-number">{overall}</div>
      <div class="score-unit">/ 100</div>
      <div class="score-label-text">{summary['score_label']}</div>
    </div>
    <div class="summary-text">
      <h1>AI Visibility Report</h1>
      <p class="summary-headline">{summary['headline']}</p>
      <p class="summary-opportunity">{summary['opportunity']}</p>
    </div>
  </div>
</header>
"""


def build_visibility_overview(data: dict) -> str:
    vis = data["visibility_scores"]
    you = vis["you"]
    avg = vis["market_avg"]
    top = vis["top_competitor"]
    top_name = vis["top_competitor_name"]
    desc = vis.get("description", "")

    def bar_row(label, value, css_class, sublabel=""):
        w = bar_width(value)
        sub = f'<span class="bar-sublabel">{sublabel}</span>' if sublabel else ""
        return f"""
        <div class="bar-row">
          <div class="bar-label">{label}{sub}</div>
          <div class="bar-track">
            <div class="bar-fill {css_class}" style="width:{w}%"></div>
          </div>
          <div class="bar-value">{value}%</div>
        </div>"""

    rows = (
        bar_row("You", you, "bar-you")
        + bar_row("Market Average", avg, "bar-avg")
        + bar_row(f"Top Competitor", top, "bar-top", f"({top_name})")
    )

    gap = top - you
    gap_note = (
        f'<p class="gap-note">You are <strong>{gap} points below</strong> the top competitor. '
        f'Closing this gap is what RankGeo is designed to do.</p>'
        if gap > 0
        else '<p class="gap-note">You are ahead of or tied with the top measured competitor.</p>'
    )

    return f"""
<section class="report-section">
  <h2>Overall AI Visibility</h2>
  <p class="section-desc">{desc}</p>
  <div class="bar-chart">{rows}</div>
  {gap_note}
</section>
"""


def build_platform_breakdown(data: dict) -> str:
    platforms = data.get("platform_breakdown", [])
    if not platforms:
        return ""

    rows = ""
    for p in platforms:
        you_w = bar_width(p["your_score"], p["max"])
        comp_w = bar_width(p["competitor_score"], p["max"])
        rows += f"""
      <div class="platform-row">
        <div class="platform-name">{p['platform']}</div>
        <div class="platform-bars">
          <div class="pb-row">
            <span class="pb-label">You</span>
            <div class="bar-track"><div class="bar-fill bar-you" style="width:{you_w}%"></div></div>
            <span class="pb-val">{p['your_score']}%</span>
          </div>
          <div class="pb-row">
            <span class="pb-label">Competitor</span>
            <div class="bar-track"><div class="bar-fill bar-top" style="width:{comp_w}%"></div></div>
            <span class="pb-val">{p['competitor_score']}%</span>
          </div>
        </div>
      </div>"""

    return f"""
<section class="report-section">
  <h2>Breakdown by AI Platform</h2>
  <p class="section-desc">How often you appeared versus your top competitor on each platform.</p>
  <div class="platform-grid">{rows}</div>
</section>
"""


def build_language_breakdown(data: dict) -> str:
    langs = data.get("language_breakdown", [])
    if not langs:
        return ""

    cards = ""
    for l in langs:
        you_w = bar_width(l["your_score"], l["max"])
        comp_w = bar_width(l["competitor_score"], l["max"])
        cls = score_color(l["your_score"])
        cards += f"""
      <div class="lang-card {cls}">
        <div class="lc-title">{l['language']}</div>
        <div class="lc-score">{l['your_score']}<span>/100</span></div>
        <div class="lc-bars">
          <div class="pb-row">
            <span class="pb-label">You</span>
            <div class="bar-track"><div class="bar-fill bar-you" style="width:{you_w}%"></div></div>
            <span class="pb-val">{l['your_score']}%</span>
          </div>
          <div class="pb-row">
            <span class="pb-label">Competitor</span>
            <div class="bar-track"><div class="bar-fill bar-top" style="width:{comp_w}%"></div></div>
            <span class="pb-val">{l['competitor_score']}%</span>
          </div>
        </div>
      </div>"""

    return f"""
<section class="report-section">
  <h2>English vs. Chinese AI Visibility</h2>
  <p class="section-desc">Bilingual presence matters — buyers search in both languages.</p>
  <div class="lang-grid">{cards}</div>
</section>
"""


def build_signal_scores(data: dict) -> str:
    signals = data.get("signal_scores", [])
    if not signals:
        return ""

    cards = ""
    for s in signals:
        cls = s.get("status", score_color(s["your_score"]))
        w = bar_width(s["your_score"], s["max"])
        lbl = score_label(s["your_score"])
        cards += f"""
      <div class="signal-card {cls}">
        <div class="sc-top">
          <div class="sc-icon">{s['icon']}</div>
          <div class="sc-info">
            <div class="sc-name">{s['signal']}</div>
            <div class="sc-status-label">{lbl}</div>
          </div>
          <div class="sc-score">{s['your_score']}</div>
        </div>
        <div class="bar-track sc-bar">
          <div class="bar-fill bar-signal-{cls}" style="width:{w}%"></div>
        </div>
        <p class="sc-note">{s['note']}</p>
      </div>"""

    return f"""
<section class="report-section">
  <h2>AI Signal Scores</h2>
  <p class="section-desc">The five factors AI uses to decide who to recommend — and how you score on each.</p>
  <div class="signals-grid">{cards}</div>
</section>
"""


def build_competitor_breakdown(data: dict) -> str:
    comps = data.get("competitor_breakdown", [])
    if not comps:
        return ""

    you = data["visibility_scores"]["you"]
    you_w = bar_width(you)

    rows = f"""
        <div class="bar-row">
          <div class="bar-label">You</div>
          <div class="bar-track"><div class="bar-fill bar-you" style="width:{you_w}%"></div></div>
          <div class="bar-value">{you}%</div>
        </div>"""

    for c in comps:
        w = bar_width(c["score"], c["max"])
        rows += f"""
        <div class="bar-row">
          <div class="bar-label">{c['name']}</div>
          <div class="bar-track"><div class="bar-fill bar-top" style="width:{w}%"></div></div>
          <div class="bar-value">{c['score']}%</div>
        </div>"""

    return f"""
<section class="report-section">
  <h2>Competitor Comparison</h2>
  <p class="section-desc">How often you appeared versus your top competitors across all tested queries.</p>
  <div class="bar-chart">{rows}</div>
</section>
"""


def build_queries_table(data: dict) -> str:
    queries = data.get("top_queries_tested", [])
    if not queries:
        return ""

    rows = ""
    for q in queries:
        badge = appeared_badge(q["appeared"], q.get("rank"))
        rows += f"""
      <tr>
        <td class="query-text-cell">"{q['query']}"</td>
        <td>{badge}</td>
      </tr>"""

    return f"""
<section class="report-section">
  <h2>Sample Queries Tested</h2>
  <p class="section-desc">A selection of the real queries we ran across AI platforms during your diagnostic.</p>
  <table class="query-table">
    <thead>
      <tr><th>Query</th><th>Result</th></tr>
    </thead>
    <tbody>{rows}</tbody>
  </table>
</section>
"""


def build_recommendations(data: dict) -> str:
    recs = data.get("recommendations", [])
    if not recs:
        return ""

    items = ""
    for i, r in enumerate(recs, 1):
        cls = priority_class(r["priority"])
        items += f"""
      <div class="rec-card">
        <div class="rec-header">
          <div class="rec-num">{i}</div>
          <div class="rec-title-group">
            <div class="rec-title">{r['title']}</div>
            <span class="priority-badge {cls}">{r['priority']} Priority</span>
          </div>
        </div>
        <p class="rec-detail">{r['detail']}</p>
      </div>"""

    return f"""
<section class="report-section">
  <h2>Recommended Actions</h2>
  <p class="section-desc">Prioritized steps to increase how often AI recommends you.</p>
  <div class="recs-list">{items}</div>
</section>
"""


def build_cta(data: dict) -> str:
    ns = data.get("next_steps", {})
    if not ns:
        return ""
    label = ns.get("cta_label", "Ready to get started?")
    url = ns.get("cta_url", "#")
    email = ns.get("contact_email", "")
    email_line = f'<p class="cta-email">Or email us: <a href="mailto:{email}">{email}</a></p>' if email else ""
    return f"""
<section class="report-section cta-section">
  <h2>{label}</h2>
  <p class="section-desc">We&rsquo;ll build a custom plan to improve your scores across every signal above.</p>
  <a href="{url}" class="cta-button">Start Improving My AI Visibility</a>
  {email_line}
</section>
"""


def build_footer(data: dict) -> str:
    meta = data["meta"]
    date_str = format_date(meta["report_date"])
    return f"""
<footer class="report-footer">
  <div class="footer-brand">Rank<span>Geo</span>.ca</div>
  <p>Prepared for {meta['client_name']} &mdash; {date_str}</p>
  <p class="footer-disclaimer">
    This report reflects AI query results captured on the report date.
    AI recommendation patterns change over time as web content evolves.
    &copy; {datetime.now().year} RankGeo. All rights reserved.
  </p>
</footer>
"""


# ──────────────────────────────────────────────
# HTML assembly
# ──────────────────────────────────────────────

HTML_TEMPLATE = """\
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>AI Visibility Report — $client_name</title>
<style>
$css
</style>
</head>
<body>
<div class="page-wrap">
$body
</div>
</body>
</html>
"""

CSS = """
/* ── Reset / Base ─────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
       background: #f0f4f8; color: #1a2332; font-size: 15px; line-height: 1.6; }
a { color: #1565d8; }
table { border-collapse: collapse; }

/* ── Page wrap ───────────────────────────── */
.page-wrap { max-width: 860px; margin: 32px auto; padding: 0 16px 64px; }

/* ── Header ──────────────────────────────── */
.report-header { background: #0d1b2a; color: #fff; border-radius: 16px;
                 padding: 32px 36px; margin-bottom: 28px; }
.header-top { display: flex; justify-content: space-between; align-items: flex-start;
              flex-wrap: wrap; gap: 16px; margin-bottom: 28px; }
.brand { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; }
.brand span { color: #22c55e; }
.report-meta { display: flex; flex-direction: column; gap: 4px; text-align: right; font-size: .85rem; }
.meta-item { display: flex; gap: 8px; align-items: baseline; justify-content: flex-end; }
.meta-label { color: rgba(255,255,255,.5); font-size: .78rem; }
.report-meta a { color: #60a5fa; }

.summary-banner { display: flex; gap: 28px; align-items: center; flex-wrap: wrap; }
.score-circle { display: flex; flex-direction: column; align-items: center;
                justify-content: center; width: 120px; min-height: 120px; border-radius: 50%;
                border: 4px solid; flex-shrink: 0; text-align: center; padding: 8px; box-sizing: border-box; }
.score-circle.good  { border-color: #22c55e; }
.score-circle.fair  { border-color: #f59e0b; }
.score-circle.weak  { border-color: #ef4444; }
.score-number { font-size: 2rem; font-weight: 800; line-height: 1; }
.score-unit   { font-size: .7rem; color: rgba(255,255,255,.5); }
.score-label-text { font-size: .72rem; font-weight: 700; text-transform: uppercase;
                    letter-spacing: .5px; margin-top: 4px; }
.score-circle.good  .score-label-text { color: #22c55e; }
.score-circle.fair  .score-label-text { color: #f59e0b; }
.score-circle.weak  .score-label-text { color: #ef4444; }

.summary-text h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; }
.summary-headline { font-size: 1rem; color: rgba(255,255,255,.85); margin-bottom: 8px; }
.summary-opportunity { font-size: .9rem; color: rgba(255,255,255,.6); }

/* ── Sections ────────────────────────────── */
.report-section { background: #fff; border-radius: 14px; padding: 28px 32px;
                  margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,.07); }
.report-section h2 { font-size: 1.15rem; font-weight: 700; color: #0d1b2a;
                     margin-bottom: 6px; }
.section-desc { font-size: .88rem; color: #64748b; margin-bottom: 20px; }

/* ── Bars ────────────────────────────────── */
.bar-chart { display: flex; flex-direction: column; gap: 14px; }
.bar-row   { display: flex; align-items: center; gap: 12px; }
.bar-label { width: 150px; font-size: .88rem; font-weight: 600; flex-shrink: 0; }
.bar-sublabel { display: block; font-size: .75rem; font-weight: 400; color: #94a3b8; }
.bar-track { flex: 1; height: 14px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
.bar-fill  { height: 100%; border-radius: 99px; transition: width .6s ease; }
.bar-you   { background: linear-gradient(90deg, #1565d8, #2196f3); }
.bar-avg   { background: #94a3b8; }
.bar-top   { background: linear-gradient(90deg, #22c55e, #4ade80); }
.bar-value { width: 44px; text-align: right; font-weight: 700; font-size: .9rem; color: #0d1b2a; }
.gap-note  { margin-top: 16px; font-size: .88rem; background: #fef9c3;
             border-left: 3px solid #f59e0b; padding: 10px 14px; border-radius: 6px; color: #78350f; }

/* ── Platform breakdown ─────────────────── */
.platform-grid { display: flex; flex-direction: column; gap: 20px; }
.platform-row  { display: flex; align-items: flex-start; gap: 16px; }
.platform-name { width: 96px; font-weight: 700; font-size: .9rem; padding-top: 3px; flex-shrink: 0; }
.platform-bars { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.pb-row  { display: flex; align-items: center; gap: 10px; }
.pb-label{ width: 76px; font-size: .8rem; color: #64748b; flex-shrink: 0; }
.pb-val  { width: 38px; text-align: right; font-size: .85rem; font-weight: 600; color: #0d1b2a; }

/* ── Language cards ─────────────────────── */
.lang-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.lang-card { border-radius: 10px; padding: 20px; border: 2px solid; }
.lang-card.good  { border-color: #22c55e; background: #f0fdf4; }
.lang-card.fair  { border-color: #f59e0b; background: #fffbeb; }
.lang-card.weak  { border-color: #ef4444; background: #fef2f2; }
.lc-title { font-weight: 700; font-size: 1rem; margin-bottom: 4px; }
.lc-score { font-size: 2rem; font-weight: 800; line-height: 1; margin-bottom: 12px; }
.lc-score span { font-size: 1rem; font-weight: 400; color: #94a3b8; }
.lc-bars  { display: flex; flex-direction: column; gap: 6px; }

/* ── Signal cards ───────────────────────── */
.signals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.signal-card  { border-radius: 10px; padding: 18px; border: 1.5px solid #e2e8f0;
                background: #fafafa; }
.sc-top  { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.sc-icon { font-size: 1.5rem; flex-shrink: 0; }
.sc-info { flex: 1; }
.sc-name { font-weight: 700; font-size: .9rem; }
.sc-status-label { font-size: .75rem; color: #64748b; }
.sc-score{ font-size: 1.4rem; font-weight: 800; }
.signal-card.good  .sc-score { color: #16a34a; }
.signal-card.fair  .sc-score { color: #d97706; }
.signal-card.weak  .sc-score { color: #dc2626; }
.sc-bar { margin-bottom: 10px; height: 8px; }
.bar-signal-good { background: linear-gradient(90deg, #22c55e, #4ade80); }
.bar-signal-fair { background: linear-gradient(90deg, #f59e0b, #fcd34d); }
.bar-signal-weak { background: linear-gradient(90deg, #ef4444, #f87171); }
.sc-note { font-size: .82rem; color: #64748b; }

/* ── Query table ────────────────────────── */
.query-table { width: 100%; font-size: .88rem; }
.query-table th { text-align: left; padding: 8px 12px; background: #f8fafc;
                  font-weight: 600; color: #475569; border-bottom: 2px solid #e2e8f0; }
.query-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
.query-table tr:last-child td { border-bottom: none; }
.query-text-cell { color: #334155; font-style: italic; }
.badge { display: inline-block; padding: 3px 10px; border-radius: 99px;
         font-size: .78rem; font-weight: 700; }
.badge-yes { background: #dcfce7; color: #166534; }
.badge-no  { background: #fee2e2; color: #991b1b; }

/* ── Recommendations ────────────────────── */
.recs-list { display: flex; flex-direction: column; gap: 14px; }
.rec-card  { border-radius: 10px; padding: 18px 20px; border: 1.5px solid #e2e8f0; }
.rec-header{ display: flex; align-items: flex-start; gap: 14px; margin-bottom: 8px; }
.rec-num   { width: 32px; height: 32px; display: flex; align-items: center;
             justify-content: center; background: #0d1b2a; color: #fff;
             border-radius: 50%; font-weight: 700; font-size: .88rem; flex-shrink: 0; }
.rec-title-group { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex: 1; }
.rec-title { font-weight: 700; font-size: .95rem; }
.priority-badge { font-size: .72rem; font-weight: 700; padding: 2px 9px;
                  border-radius: 99px; }
.priority-high   { background: #fee2e2; color: #991b1b; }
.priority-medium { background: #fef9c3; color: #78350f; }
.priority-low    { background: #f0fdf4; color: #166534; }
.rec-detail { font-size: .87rem; color: #475569; }

/* ── CTA ────────────────────────────────── */
.cta-section { text-align: center; background: linear-gradient(135deg, #0d1b2a, #1e3a5f); color: #fff; }
.cta-section h2 { color: #fff; }
.cta-section .section-desc { color: rgba(255,255,255,.65); }
.cta-button { display: inline-block; margin-top: 8px; padding: 14px 32px;
              background: linear-gradient(90deg, #1565d8, #2196f3);
              color: #fff; font-weight: 700; font-size: 1rem;
              border-radius: 99px; text-decoration: none;
              box-shadow: 0 4px 16px rgba(21,101,216,.4); }
.cta-email { margin-top: 14px; font-size: .88rem; color: rgba(255,255,255,.55); }
.cta-email a { color: #60a5fa; }

/* ── Footer ─────────────────────────────── */
.report-footer { text-align: center; padding: 24px 0 0; font-size: .82rem; color: #94a3b8; }
.footer-brand { font-size: 1.1rem; font-weight: 800; color: #0d1b2a; margin-bottom: 4px; }
.footer-brand span { color: #22c55e; }
.footer-disclaimer { margin-top: 8px; font-size: .77rem; max-width: 560px; margin-inline: auto; }

/* ── Print / PDF ─────────────────────────── */
@media print {
  body { background: #fff; font-size: 13px; }
  .page-wrap { margin: 0; padding: 0; max-width: 100%; }
  .report-section { box-shadow: none; }
  .rec-card, .signal-row, .platform-row, .lang-row, .query-row { break-inside: avoid; }
  .cta-section { break-inside: avoid; }
  /* Force ALL background colours to print — browsers suppress them by default */
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}

/* ── Responsive ──────────────────────────── */
@media (max-width: 600px) {
  .report-header { padding: 20px; }
  .summary-banner { gap: 16px; }
  .header-top { flex-direction: column; }
  .report-meta { text-align: left; }
  .meta-item { justify-content: flex-start; }
  .report-section { padding: 20px 18px; }
  .signals-grid, .lang-grid { grid-template-columns: 1fr; }
  .bar-label { width: 110px; }
  .platform-name { width: 76px; }
}
"""


def render_html(data: dict) -> str:
    body = (
        build_header(data)
        + build_visibility_overview(data)
        + build_competitor_breakdown(data)
        + build_platform_breakdown(data)
        + build_language_breakdown(data)
        + build_signal_scores(data)
        + build_queries_table(data)
        + build_recommendations(data)
        + build_cta(data)
        + build_footer(data)
    )
    client_name = data["meta"]["client_name"]
    return Template(HTML_TEMPLATE).substitute(
        client_name=client_name,
        css=CSS,
        body=body,
    )


# ──────────────────────────────────────────────
# PDF export (optional — requires weasyprint)
# ──────────────────────────────────────────────

def export_pdf(html_path: str, pdf_path: str) -> None:
    try:
        from weasyprint import HTML  # type: ignore
    except ImportError:
        print(
            "\nWeasyPrint is not installed. Install it with:\n"
            "  pip install weasyprint\n"
            "Skipping PDF export."
        )
        return
    print(f"Generating PDF → {pdf_path}")
    HTML(filename=html_path).write_pdf(pdf_path)
    print("PDF saved.")


# ──────────────────────────────────────────────
# Entry point
# ──────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="RankGeo — Generate an AI Visibility Report from structured JSON."
    )
    parser.add_argument("input", help="Path to input JSON file (e.g. sample_input.json)")
    parser.add_argument(
        "--out", "-o", default=None,
      help="Output HTML filename (default: outputs/<client_name>_ai_report.html)"
    )
    parser.add_argument(
        "--pdf", action="store_true",
        help="Also export a PDF version (requires weasyprint)"
    )
    args = parser.parse_args()

    data = load_json(args.input)
    html = render_html(data)

    # Determine output path
    if args.out:
        out_path = args.out
    else:
        safe_name = data["meta"]["client_name"].replace(" ", "_").lower()
        out_path = f"outputs/{safe_name}_ai_report.html"

    # Write HTML
    out_full = Path(out_path)
    out_full.parent.mkdir(parents=True, exist_ok=True)
    out_full.write_text(html, encoding="utf-8")
    print(f"Report saved → {out_full.resolve()}")

    # Optional PDF
    if args.pdf:
        pdf_path = str(out_full.with_suffix(".pdf"))
        export_pdf(str(out_full.resolve()), pdf_path)


if __name__ == "__main__":
    main()
