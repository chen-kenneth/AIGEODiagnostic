#!/usr/bin/env python3
"""
query_chatgpt.py
----------------
Runs a set of natural-language queries through the ChatGPT API and records
which realtors are mentioned in each response, at what position.

Usage:
  export OPENAI_API_KEY=sk-...
  python query_chatgpt.py

Output: prints a results table and writes chatgpt_results.json
        which you can paste into sample_input.json → top_queries_tested
"""

import json
import os
import sys
import time
import argparse
from pathlib import Path

from openai import OpenAI

# ── Config loader ─────────────────────────────────────────────────────────────

CONFIG_PATH = Path(__file__).parent / "query_config.json"

def load_config(path: Path) -> dict:
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        sys.exit(f"Error: config file not found — {path}")
    except json.JSONDecodeError as e:
        sys.exit(f"Error: invalid JSON in {path}\n{e}")

CFG = load_config(CONFIG_PATH)

TRACKED_NAMES = CFG["tracked_names"]
SYSTEM_PROMPT = CFG["system_prompt"]
MODEL = CFG["model"]
FALLBACK_MODEL = CFG.get("fallback_model", "gpt-4o")


def build_query_plan(cfg: dict, run_mode: str = "detailed") -> list[dict]:
    """
    Build the execution plan.
    - brief: sample_queries only
    - detailed: sample_queries + background queries/groups
    - sample_queries are shown in the report and included in stats
    - background queries are included in stats, hidden from sample report table
    - legacy queries: treated as sample_queries for backward compatibility
    """
    plan = []

    sample_queries = cfg.get("sample_queries") or cfg.get("queries") or []
    for query in sample_queries:
        plan.append({
            "query": query,
            "query_group": "sample",
            "include_in_sample_report": True,
        })

    if run_mode == "detailed":
        for query in cfg.get("background_queries", []):
            plan.append({
                "query": query,
                "query_group": "background",
                "include_in_sample_report": False,
            })

        for group_name, queries in (cfg.get("background_query_groups") or {}).items():
            for query in queries:
                plan.append({
                    "query": query,
                    "query_group": group_name,
                    "include_in_sample_report": False,
                })

    return plan

# ── Helpers ───────────────────────────────────────────────────────────────────

def extract_mentions(text: str, names: list[str]) -> list[dict]:
    """
    Return a list of {name, rank, excerpt} for every tracked name found
    in `text`. Rank is determined by order of first appearance.
    """
    found = []
    text_lower = text.lower()
    for name in names:
        idx = text_lower.find(name.lower())
        if idx != -1:
            # Grab a short excerpt around the mention
            start = max(0, idx - 40)
            end = min(len(text), idx + len(name) + 80)
            excerpt = text[start:end].replace("\n", " ").strip()
            found.append({"name": name, "position": idx, "excerpt": f"…{excerpt}…"})
    # Sort by position of first mention → rank
    found.sort(key=lambda x: x["position"])
    for i, item in enumerate(found, 1):
        item["rank"] = i
        del item["position"]
    return found


def extract_text_from_response(response) -> str:
    """
    Best-effort extraction of assistant text across SDK/model response shapes.
    """
    choices = getattr(response, "choices", None) or []
    if not choices:
        return ""

    message = getattr(choices[0], "message", None)
    if message is None:
        return ""

    content = getattr(message, "content", "")
    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        chunks = []
        for part in content:
            if isinstance(part, dict):
                text = part.get("text") or ""
                if text:
                    chunks.append(text)
                continue

            text_val = getattr(part, "text", None)
            if text_val:
                chunks.append(text_val)
        return "\n".join(chunks).strip()

    return ""


def response_to_dict(response) -> dict:
    """
    Convert OpenAI SDK object to a JSON-serializable dict for debug printing.
    """
    if hasattr(response, "model_dump"):
        return response.model_dump()
    if hasattr(response, "model_dump_json"):
        return json.loads(response.model_dump_json())
    return {"raw": str(response)}


def get_finish_reason(raw_payload: dict) -> str:
    choices = raw_payload.get("choices") or []
    if not choices:
        return ""
    return choices[0].get("finish_reason") or ""


def call_chat_completion(client: OpenAI, model: str, query: str, max_tokens: int, timeout_s: int):
    return client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": query},
        ],
        max_completion_tokens=max_tokens,
        timeout=timeout_s,
    )


def run_query(client: OpenAI, query_item: dict, show_raw: bool = False, timeout_s: int = 45) -> dict:
    query = query_item["query"]
    print(f'\n🔍 Query: "{query}"')
    response = call_chat_completion(
        client=client,
        model=MODEL,
        query=query,
        max_tokens=int(CFG["max_tokens"]),
        timeout_s=timeout_s,
    )

    raw_payload = response_to_dict(response)
    answer = extract_text_from_response(response)
    finish_reason = get_finish_reason(raw_payload)
    used_model = MODEL

    # gpt-5 can consume the whole completion budget as reasoning tokens and return no visible text.
    if not answer and finish_reason == "length":
        retry_model = FALLBACK_MODEL if FALLBACK_MODEL else MODEL
        retry_tokens = max(int(CFG["max_tokens"]) * 2, 1200)
        print(
            f"   ℹ️  Empty response with finish_reason='length'. "
            f"Retrying with model={retry_model}, max_completion_tokens={retry_tokens}..."
        )
        retry_response = call_chat_completion(
            client=client,
            model=retry_model,
            query=query,
            max_tokens=retry_tokens,
            timeout_s=timeout_s,
        )
        retry_raw_payload = response_to_dict(retry_response)
        retry_answer = extract_text_from_response(retry_response)

        if retry_answer:
            response = retry_response
            answer = retry_answer
            used_model = retry_model
            raw_payload = {
                "primary": raw_payload,
                "retry": retry_raw_payload,
            }
        else:
            raw_payload = {
                "primary": raw_payload,
                "retry": retry_raw_payload,
            }

    mentions = extract_mentions(answer, TRACKED_NAMES)

    print(f"   Response ({len(answer)} chars):")
    print("   " + answer.replace("\n", "\n   "))

    if show_raw or not answer:
        print("\n   🧾 Full raw API payload:")
        print(json.dumps(raw_payload, indent=2, ensure_ascii=False))

    if mentions:
        print(f"\n   ✅ Tracked names found:")
        for m in mentions:
            print(f"      #{m['rank']} {m['name']}  —  {m['excerpt']}")
    else:
        print("   ⚠️  None of the tracked names were mentioned.")

    return {
        "query": query,
        "query_group": query_item.get("query_group", "sample"),
        "include_in_sample_report": bool(query_item.get("include_in_sample_report", True)),
        "platform": f"ChatGPT ({used_model})",
        "full_response": answer,
        "tracked_mentions": mentions,
        "raw_response": raw_payload,
        # top_queries_tested schema fields:
        "appeared": len(mentions) > 0,
        "rank": mentions[0]["rank"] if mentions else None,
        "first_mentioned": mentions[0]["name"] if mentions else None,
    }


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Run configured queries against ChatGPT and record mentions.")
    parser.add_argument(
        "--show-raw",
        action="store_true",
        help="Print full raw API payload for every query (auto-enabled when response text is empty).",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=int(CFG.get("timeout_seconds", 45)),
        help="Per-request timeout in seconds (default: 45 or config timeout_seconds).",
    )
    parser.add_argument(
        "--run-mode",
        choices=["brief", "detailed"],
        default="detailed",
        help="brief=run only sample_queries, detailed=run sample_queries + background queries (default: detailed).",
    )
    parser.add_argument(
        "--out",
        default="outputs/chatgpt_results.json",
        help="Output JSON path (default: outputs/chatgpt_results.json).",
    )
    args = parser.parse_args()

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        sys.exit(
            "Error: OPENAI_API_KEY is not set.\n"
            "Run:  export OPENAI_API_KEY=sk-..."
        )

    client = OpenAI(api_key=api_key)

    query_plan = build_query_plan(CFG, run_mode=args.run_mode)
    sample_count = sum(1 for q in query_plan if q.get("include_in_sample_report", True))
    background_count = len(query_plan) - sample_count
    print(
        f"Run mode: {args.run_mode} | sample queries: {sample_count} | "
        f"background queries: {background_count} | total: {len(query_plan)}"
    )

    results = []
    for i, query_item in enumerate(query_plan):
        try:
            result = run_query(client, query_item, show_raw=args.show_raw, timeout_s=args.timeout)
        except Exception as e:
            print(f"   ❌ Query failed: {type(e).__name__}: {e}")
            result = {
                "query": query_item["query"],
                "query_group": query_item.get("query_group", "sample"),
                "include_in_sample_report": bool(query_item.get("include_in_sample_report", True)),
                "platform": f"ChatGPT ({MODEL})",
                "full_response": "",
                "tracked_mentions": [],
                "raw_response": None,
                "appeared": False,
                "rank": None,
                "first_mentioned": None,
                "error": f"{type(e).__name__}: {e}",
            }
        results.append(result)
        if i < len(query_plan) - 1:
            time.sleep(1)  # be polite to the API

    # Write full results
    out_path = args.out
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\n\n📄 Full results written to {out_path}")

    # Print the snippet you can paste into sample_input.json
    snippet = [
        {
            "query": r["query"],
            "appeared": r["appeared"],
            "rank": r["rank"],
        }
        for r in results
        if r.get("include_in_sample_report", True)
    ]
    print("\n── Paste into sample_input.json → top_queries_tested ──")
    print(json.dumps(snippet, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
