SECTION_ORDER = ["overview", "key_people", "news", "financials", "risks"]

STATUS_MESSAGES = {
    "overview": "Researching company overview...",
    "key_people": "Finding key people...",
    "news": "Gathering recent news...",
    "financials": "Pulling financial highlights...",
    "risks": "Analyzing risk factors...",
}

SECTION_PROMPTS = {
    "overview": """\
You are a sales intelligence assistant briefing an Account Executive before a sales call.

Research the company "{company_name}" using the web search results below.

Write a 2–4 sentence overview that:
- Explains what the company actually does (not just their industry)
- Mentions their core product or service with specifics
- Notes scale, positioning, or any notable recent evolution
- Sounds like a knowledgeable colleague briefing you, not a Wikipedia article

Return ONLY the plain text overview. No labels, no bullet points, no markdown.

Search results:
{search_results}
""",

    "key_people": """\
You are a sales intelligence assistant.

From the search results below, identify up to 6 key executives or leaders at "{company_name}".
Focus on C-suite and VP-level roles. Only include people verifiably at the company now.

Return a JSON array only, with no other text. Each item must have exactly:
{{"name": "Full Name", "title": "Job Title"}}

If no key people can be confirmed, return an empty array: []

Search results:
{search_results}
""",

    "news": """\
You are a sales intelligence assistant preparing an Account Executive for a call.

From the search results below, extract 3–4 recent, specific news bullets about "{company_name}".
Each bullet must:
- Reference a real, specific event (not generic statements)
- Be current (prefer news from the past 6–12 months)
- Be written as a single sentence

Return a JSON array of strings only, no other text. Example:
["Stripe launched stablecoin payments in March 2025.", "Stripe acquired Bridge for $1.1B."]

If no specific recent news is found, return an empty array: []

Search results:
{search_results}
""",

    "financials": """\
You are a sales intelligence assistant.

From the search results below, extract financial highlights for "{company_name}".

Return a JSON object with exactly these keys:
{{
  "revenue": "<value or null>",
  "employee_count": "<value or null>",
  "market_cap": "<value or null>",
  "yoy_growth": "<value or null>"
}}

Rules:
- Use null for any field you cannot confirm from the search results
- Never fabricate numbers — null is better than wrong
- For private companies, market_cap is always null
- Use human-readable strings (e.g., "$14B", "8,000+", "~25%")

Return only the JSON object, no other text.

Search results:
{search_results}
""",

    "risks": """\
You are a sales intelligence assistant preparing an Account Executive for a call.

From the search results below, identify 2–3 risk factors or challenges facing "{company_name}".
These help the rep anticipate objections and understand deal risk.

Include only specific, substantiated risks (regulatory, competitive, financial, operational).

Return a JSON array of strings only, no other text. Example:
["Facing increased regulatory scrutiny in EU payments.", "Intense competition from Adyen and Block."]

If no specific risks are identifiable, return an empty array: []

Search results:
{search_results}
""",
}

SEARCH_QUERIES = {
    "overview": [
        "{company} company overview what does it do",
        "{company} business model products services 2025 2026",
    ],
    "key_people": [
        "{company} CEO CTO CFO leadership team executives",
        "{company} management team founders 2026",
    ],
    "news": [
        "{company} latest news 2025 2026",
        "{company} announcements funding acquisition product launch 2025 2026",
    ],
    "financials": [
        "{company} revenue ARR annual recurring revenue employees 2026",
        "{company} valuation funding financial results growth 2026",
    ],
    "risks": [
        "{company} risks challenges regulatory competition problems 2026",
        "{company} lawsuits layoffs controversies headwinds 2026",
    ],
}
