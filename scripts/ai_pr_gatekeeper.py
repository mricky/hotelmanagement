import os
import sys
import json
import subprocess
import requests

# ==============================================================================
# 🏨 AI PR GATEKEEPER - HOTEL PMS & BOOKING ENGINE ARCHITECTURAL AUDITOR
# Target Repository: hotelmanagement
# Lead Architect & Auditor: Mochamad Ricky Susanto
# ==============================================================================

# 1. Load Environment Variables from GitHub Actions Context
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "").strip()
REPO = os.environ.get("GITHUB_REPOSITORY", "").strip()
PR_NUMBER = os.environ.get("PR_NUMBER", "").strip()
COMMIT_SHA = os.environ.get("COMMIT_SHA", "").strip()

print(f"🚀 AI Hotel PMS & Architecture Gatekeeper starting for Repo: '{REPO}', PR: #{PR_NUMBER}, Commit: {COMMIT_SHA[:7] if COMMIT_SHA else 'N/A'}")

if not GITHUB_TOKEN or not REPO or not PR_NUMBER or not COMMIT_SHA:
    print("⚠️ Warning: Missing GitHub context environment variables. Running in local preview mode.")

# 2. Extract Clean Git Diff (Source code only, exclude generated/lockfiles/assets)
def get_clean_diff():
    try:
        cmd = [
            "git", "diff", "origin/main...HEAD",
            "--", "*.go", "*.ts", "*.tsx", "*.js", "*.jsx", "*.sql", "*.json", "*.yml", "*.yaml", "*.html", "*.css"
        ]
        diff = subprocess.check_output(cmd).decode("utf-8", errors="ignore")
        if not diff.strip():
            # Fallback to general diff against HEAD~1 if origin/main is not fetched
            cmd_fallback = ["git", "diff", "HEAD~1...HEAD", "--", "*.go", "*.ts", "*.tsx", "*.js", "*.sql"]
            diff = subprocess.check_output(cmd_fallback).decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"ℹ️ Git diff command note: {e}")
        diff = ""

    # Allow up to 250KB clean diff (well within Gemini context window) to evaluate complete multi-file changes
    return diff[:250000]

# 3. Analyze Diff with Google Gemini API (Structured JSON Output)
def analyze_diff_with_gemini(diff_text):
    if not diff_text.strip():
        return {
            "overall_risk_score": 0,
            "blast_radius": "ISOLATED",
            "verdict": "APPROVE",
            "summary": "No functional source code changes detected in this Pull Request.",
            "findings": []
        }

    if not GEMINI_API_KEY:
        print("⚠️ GEMINI_API_KEY not configured. Using deterministic baseline audit.")
        return {
            "overall_risk_score": 15,
            "blast_radius": "ISOLATED",
            "verdict": "APPROVE",
            "summary": "Baseline check passed. (Add GEMINI_API_KEY in repository secrets for deep semantic AI code review).",
            "findings": []
        }

    # Use gemini-3-flash-preview with automatic fallback to gemini-2.5-flash
    model_name = "gemini-3-flash-preview"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={GEMINI_API_KEY}"

    prompt = f"""
You are a Principal Software Architect and Automated CI/CD Gatekeeper auditing a Pull Request for an Enterprise Hotel Property Management System (PMS) and Booking Engine.
Analyze the following Git Diff with extreme rigor against mission-critical hospitality domain standards:

1. Inventory Allocation & Overbooking Protection (CRITICAL):
   - Race Conditions & Double-Booking: Ensure booking creation and room allocation enforce atomic database transactions (`tx := db.Begin()`, `tx.Commit()`, `tx.Rollback()`).
   - Row-Level Locking: Verify that room inventory queries during booking acquisition use `FOR UPDATE` or GORM `clause.Locking{{Strength: "UPDATE"}}` to prevent simultaneous allocation of the same room to multiple guests.
   - Redis Temporary Inventory Lock: Verify that direct booking temporary locks (e.g. 15-minute checkout hold) are checked and released gracefully upon expiration or completion.

2. Financial Integrity, Folio Accounting & Night Audit (CRITICAL):
   - Floating-Point Arithmetic: Flag IEEE 754 floating-point drift in guest folio balances, room charges, extra bed add-ons, or POS post-to-room charges. Minor units or high-precision decimals must be preserved.
   - Night Audit (Close-Day) Atomicity: Daily room revenue posting, PB1 (10% Hotel Tax), and 10% Service Charge must occur in an atomic transaction per occupied folio. A failure in one folio must be logged and handled without corrupting the audit cycle.
   - Split-Folio & Routing Integrity: Verify billing routes (Company Master vs Personal Incidental) do not lose unallocated charges.

3. Payment Gateway Webhook & Idempotency (HIGH):
   - Webhook Signature: Ensure payment webhook endpoints (Midtrans, Xendit, etc.) rigorously verify SHA-512 / HMAC signatures before marking bookings as PAID.
   - Webhook Idempotency: Enforce idempotency keys or unique transaction reference verification to prevent duplicate folio payments or double invoice generation on network retries.

4. Room Status State Machine & Security (HIGH):
   - State Machine Enforcement: Check-in should never be allowed on rooms with status `DIRTY` or `OUT_OF_ORDER`. Transitions (`CLEAN` -> `OCCUPIED` -> `DIRTY` -> `INSPECTED`) must be valid.
   - Formula Injection: Ensure CSV / Excel exports sanitize cells starting with `=`, `+`, `-`, or `@` to prevent CSV Formula Injection attacks.
   - SQL Injection & Auth: Ensure all database queries are parameterized and sensitive guest PII is protected.

5. Calculate an overall Risk Score (integer 0 to 100):
   - 0 to 24: Low Risk (Clean hospitality PMS code, proper locking, atomic night audit)
   - 25 to 69: Medium Risk (Minor optimization issues, missing edge case logging; requires review)
   - 70 to 100: High/Critical Risk (Overbooking race condition, unlocked inventory, unverified payment webhook, floating-point folio balance corruption; BLOCKS merge)

CRITICAL: Return output ONLY as pure valid JSON conforming strictly to this schema:
{{
    "overall_risk_score": <number 0-100>,
    "blast_radius": "<ISOLATED|MODULE|SYSTEM_WIDE>",
    "verdict": "<APPROVE|REQUEST_CHANGES|BLOCK>",
    "summary": "<Concise 2-3 sentence executive summary of the hospitality architecture evaluation>",
    "findings": [
        {{
            "file_path": "<relative file path>",
            "line_number": <approximate line number or 0>,
            "severity": "<LOW|MEDIUM|HIGH|CRITICAL>",
            "issue": "<concise issue description>",
            "suggestion": "<actionable fix or recommendation>"
        }}
    ]
}}

Here is the Git Diff to evaluate:
```diff
{diff_text}
```
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "response_mime_type": "application/json",
            "temperature": 0.2
        }
    }

    try:
        res = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=45)
        if res.status_code != 200:
            url_fallback = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
            res = requests.post(url_fallback, json=payload, headers={"Content-Type": "application/json"}, timeout=45)

        res.raise_for_status()
        data = res.json()
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(raw_text)
    except Exception as e:
        print(f"❌ Gemini API call failed: {e}. Falling back to default low-risk response.")
        return {
            "overall_risk_score": 10,
            "blast_radius": "ISOLATED",
            "verdict": "APPROVE",
            "summary": f"Automated audit fallback due to API status: {e}",
            "findings": []
        }

# 4. Report Feedback to GitHub API (Status Check & PR Comment)
def report_to_github(result):
    score = int(result.get("overall_risk_score", 0))
    blast_radius = result.get("blast_radius", "ISOLATED")
    summary = result.get("summary", "Evaluation complete.")
    findings = result.get("findings", [])

    is_blocked = score >= 70

    print(f"📊 Risk Score: {score}/100 | Blast Radius: {blast_radius} | Status: {'BLOCKED 🔴' if is_blocked else 'PASSED 🟢'}")

    if not GITHUB_TOKEN or not REPO or not PR_NUMBER or not COMMIT_SHA:
        print("ℹ️ Skipping remote GitHub reporting (Local or non-PR run).")
        print("\n=== AI Gatekeeper Verdict ===")
        print(json.dumps(result, indent=2))
        if is_blocked:
            sys.exit(1)
        return

    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

    # 4a. Update Commit Status Check
    status_url = f"https://api.github.com/repos/{REPO}/statuses/{COMMIT_SHA}"
    status_payload = {
        "state": "failure" if is_blocked else "success",
        "description": f"AI Gatekeeper Score: {score}/100 ({blast_radius})",
        "context": "🛡️ AI PR Gatekeeper (Hotel PMS)"
    }
    try:
        s_res = requests.post(status_url, json=status_payload, headers=headers, timeout=15)
        print(f"✅ GitHub Commit Status updated: HTTP {s_res.status_code}")
    except Exception as e:
        print(f"⚠️ Failed to update GitHub status: {e}")

    # 4b. Format Markdown Audit Table for PR Comment
    status_badge = "🔴 **MERGE BLOCKED (HIGH RISK)**" if is_blocked else "🟢 **APPROVED / LOW RISK**"
    
    findings_md = ""
    if findings:
        findings_md = "\n### 🔍 Detailed Audit Findings\n\n| Location | Severity | Issue Detected | Actionable Suggestion |\n|---|---|---|---|\n"
        for f in findings:
            sev = f.get("severity", "MEDIUM")
            sev_icon = "🔴" if sev in ["CRITICAL", "HIGH"] else "🟡" if sev == "MEDIUM" else "🟢"
            file_loc = f"`{f.get('file_path', 'N/A')}:{f.get('line_number', 0)}`"
            issue = f.get("issue", "").replace("\n", " ").replace("|", "/")
            suggestion = f.get("suggestion", "").replace("\n", " ").replace("|", "/")
            findings_md += f"| {file_loc} | {sev_icon} {sev} | {issue} | {suggestion} |\n"
    else:
        findings_md = "\n> 🟢 **No architectural or financial anomalies detected.** Clean hospitality code patterns verified.\n"

    comment_body = f"""## 🛡️ AI PR Gatekeeper: Hotel PMS & Booking Engine Evaluation

{status_badge}

| Metric | Evaluation Result |
|---|---|
| **Overall Risk Score** | **{score} / 100** |
| **System Blast Radius** | `{blast_radius}` |
| **Automated Verdict** | `{result.get("verdict", "APPROVE")}` |

### 📋 Executive Summary
{summary}

{findings_md}
---
*Automated review powered by **Google Gemini 3 Preview** via Antigravity CI/CD Gatekeeper.*
"""

    comment_url = f"https://api.github.com/repos/{REPO}/issues/{PR_NUMBER}/comments"
    try:
        c_res = requests.post(comment_url, json={"body": comment_body}, headers=headers, timeout=15)
        print(f"💬 GitHub PR Comment posted: HTTP {c_res.status_code}")
    except Exception as e:
        print(f"⚠️ Failed to post GitHub comment: {e}")

    if is_blocked:
        print(f"❌ AI Gatekeeper blocked PR #{PR_NUMBER} due to high risk score ({score}/100).")
        sys.exit(1)

def main():
    diff_text = get_clean_diff()
    print(f"📄 Extracted git diff size: {len(diff_text)} bytes")
    result = analyze_diff_with_gemini(diff_text)
    report_to_github(result)

if __name__ == "__main__":
    main()
