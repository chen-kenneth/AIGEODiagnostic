# RankGeo — AI Visibility Report Generator

Runs real queries through the ChatGPT API, detects which realtors are mentioned,
and generates a polished client-facing HTML report. No web server, no database, no login.

## Requirements

- Python 3.8+
- An OpenAI API key with credits ([platform.openai.com](https://platform.openai.com))
- Optional PDF export: `pip install weasyprint` + `brew install pango`

## Setup (first time only)

```bash
cd report
python3 -m venv .venv
source .venv/bin/activate
pip install openai
export OPENAI_API_KEY=sk-...   # add to ~/.zshrc to avoid repeating
```

## Normal workflow

Every time you want to run a fresh diagnostic:

```bash
# 1. Activate the virtual environment (if not already active)
source .venv/bin/activate

# 2. Run queries against ChatGPT
python query_chatgpt.py --run-mode brief
#    → writes outputs/chatgpt_results.json
#    (debug: python query_chatgpt.py --show-raw)
#    brief = 10 sample queries only
#    detailed = sample + background checks
#    e.g. python query_chatgpt.py --run-mode detailed

# 3. Convert results into report format
python build_report_input.py
#    → writes outputs/report_input.json

# 4. Generate the HTML report
python generate_report.py outputs/report_input.json --out outputs/haiyun_jun_ai_report.html
#    → open outputs/haiyun_jun_ai_report.html in your browser

# Optional: also export a PDF
python generate_report.py outputs/report_input.json --out outputs/haiyun_jun_ai_report.html --pdf
```

## Configuration — query_config.json

All settings live in `query_config.json`. Edit this file to change anything.

| Field | Purpose |
|---|---|
| `model` | ChatGPT model to use (`"gpt-4o"`, `"gpt-4o-mini"`, etc.) |
| `temperature` | Legacy field. Some `gpt-4o` variants reject non-default temperature; script ignores this safely. |
| `max_tokens` | Max length of each ChatGPT response |
| `system_prompt` | Instructions given to ChatGPT before each query |
| `sample_queries` | The 10 headline queries shown in the report table (`top_queries_tested`) |
| `background_query_groups` | Extra grouped checks that still run and count in visibility stats, but are hidden from the sample query table |
| `client_names` | Your client's name(s) — used to calculate their appearance rate |
| `tracked_names` | All names to detect in responses (client + competitors) |

## Files

| File | Purpose |
|---|---|
| `query_config.json` | All configuration — edit this |
| `query_chatgpt.py` | Runs queries, writes `outputs/chatgpt_results.json` |
| `build_report_input.py` | Converts results → `outputs/report_input.json` |
| `generate_report.py` | Renders `outputs/report_input.json` → HTML report |
| `outputs/chatgpt_results.json` | Raw API responses (auto-generated) |
| `outputs/report_input.json` | Computed stats for the report (auto-generated) |

## PDF export (macOS)

WeasyPrint requires several native libraries. Install them once with brew, then
set `DYLD_LIBRARY_PATH` before running the script (the venv alone isn't enough):

```bash
brew install pango harfbuzz glib fontconfig libffi

export DYLD_LIBRARY_PATH=\
$(brew --prefix harfbuzz)/lib:\
$(brew --prefix pango)/lib:\
$(brew --prefix glib)/lib:\
$(brew --prefix fontconfig)/lib:\
$(brew --prefix libffi)/lib:\
$DYLD_LIBRARY_PATH

python generate_report.py outputs/report_input.json --out outputs/haiyun_jun_ai_report.html --pdf
```

Add the `export` block to `~/.zshrc` so you don't have to repeat it.

## Cost estimate

Each query costs ~$0.001 using gpt-4o. A 10-query run costs less than **$0.01**.
Check usage at [platform.openai.com/usage](https://platform.openai.com/usage).

