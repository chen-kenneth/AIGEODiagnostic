# RankGeo — AI Visibility Report Generator

A standalone Python script that turns structured JSON diagnostic data into a
polished, client-friendly HTML report. No web server, no database, no login.

## Requirements

- Python 3.8+
- No third-party packages required for HTML output
- Optional PDF export: `pip install weasyprint`

## Usage

```bash
# Generate HTML report (default output name: <client>_ai_report.html)
python generate_report.py sample_input.json

# Specify a custom output filename
python generate_report.py sample_input.json --out reports/sarah_q1.html

# Also export a PDF alongside the HTML
python generate_report.py sample_input.json --pdf
```

## Input JSON structure

All fields in top-level objects are required unless marked optional.

```jsonc
{
  "meta": {
    "report_date": "YYYY-MM-DD",
    "prepared_by": "RankGeo",
    "client_name": "Sarah Li",
    "client_title": "Ottawa Realtor",
    "client_website": "https://...",
    "language": "en"           // reserved for future use
  },
  "summary": {
    "overall_score": 34,       // 0–100
    "score_label": "Needs Improvement",
    "score_color": "orange",   // "green" | "orange" | "red"
    "headline": "...",
    "opportunity": "..."
  },
  "visibility_scores": {
    "description": "...",
    "you": 34,
    "market_avg": 41,
    "top_competitor": 61,
    "top_competitor_name": "David Wong"
  },
  "platform_breakdown": [      // optional
    { "platform": "ChatGPT", "your_score": 40, "competitor_score": 68, "max": 100 }
  ],
  "language_breakdown": [      // optional
    { "language": "English", "your_score": 22, "competitor_score": 65, "max": 100 }
  ],
  "signal_scores": [           // optional
    {
      "signal": "Mention Frequency",
      "icon": "🔁",
      "your_score": 30,
      "max": 100,
      "status": "weak",        // "good" | "fair" | "weak"
      "note": "..."
    }
  ],
  "top_queries_tested": [      // optional
    { "query": "...", "appeared": true, "rank": 2 }
  ],
  "recommendations": [         // optional
    { "priority": "High", "title": "...", "detail": "..." }
  ],
  "next_steps": {              // optional
    "cta_label": "Ready to get started?",
    "cta_url": "https://rankgeo.ca/#cta-form",
    "contact_email": "hello@rankgeo.ca"
  }
}
```

See `sample_input.json` for a complete working example.

## PDF export

PDF generation uses [WeasyPrint](https://weasyprint.org/), which renders the
same HTML/CSS as the browser. Install it, then pass `--pdf`:

```bash
pip install weasyprint
python generate_report.py sample_input.json --pdf
```

On macOS you may also need: `brew install pango`
