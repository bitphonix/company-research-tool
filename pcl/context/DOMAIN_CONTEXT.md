# DOMAIN_CONTEXT.md — Domain Knowledge

## Who We're Building For

**Account Executives (AEs)** and **Sales Development Reps (SDRs)**.

These are people who:
- Take 5–10 meetings per day
- Are often prepping in a 5-minute gap between calls
- Need to sound informed, not just read a Wikipedia page aloud
- Get embarrassed if they don't know something the prospect announced last week
- Are NOT technical — they need clean UI, zero learning curve

**This tool is not a research tool. It's a confidence tool.**
The rep should feel prepared after scanning it for 2 minutes.

---

## Why Each Section Exists (sales context)

### overview
The rep's 30-second primer. Before they dial in, they need to answer:
"What does this company actually do?" — without sounding like they Googled it 5 minutes ago.
The briefing should feel like a colleague who knows the company explained it to them.
NOT a Wikipedia summary. Write like a human briefing another human.

### key_people
Who the rep is talking to changes everything.
- Talking to a CTO → technical conversation, ROI on engineering time
- Talking to a CFO → budget, cost savings, risk
- Talking to a CISO → security, compliance, vendor risk
- Talking to a VP of Procurement → pricing, contract terms
If the rep doesn't know who's on the call, they might pitch the wrong value prop entirely.

### news
The most dangerous section if it's wrong. Stale or fabricated news kills credibility.
A rep who says "I saw you're expanding to Europe" when the company just announced layoffs
looks completely out of touch.
**Live web search is mandatory here.** Nothing from training data.
3–4 bullets max. Current and specific.

### financials
Helps the rep understand deal sizing context:
- $100M ARR company vs $1B ARR company = different conversation about price
- 500 employees vs 50,000 employees = different procurement process
- High YoY growth = expansion budget available, different urgency
- Private company = no market cap, but revenue/headcount still matter
Never fabricate. null is better than wrong.

### risks
The "don't get blindsided" section.
If the company is under regulatory scrutiny and the rep is selling compliance software → opportunity.
If the company just had a major security breach and the rep is selling security → extremely warm lead.
If the company is in financial trouble → deal risk, maybe not worth pursuing.
Reps need to anticipate what the prospect might bring up defensively.

---

## Output Quality Bar

### What "good" looks like
**overview (good):**
"Stripe is a developer-first payments infrastructure company serving businesses of all sizes. Its core product is a payment processing API used by over 1 million businesses globally, from startups to enterprise. Stripe has expanded into adjacent products including Billing, Treasury, and Radar (fraud detection), positioning itself as a full-stack financial OS for internet businesses."

**overview (bad):**
"Stripe is a technology company that offers payment processing services. It was founded in 2010 by Patrick and John Collison. The company is headquartered in San Francisco."

### What "bad" looks like
- Generic statements that could apply to any company
- Information that could be from 2019
- Fabricated revenue numbers
- Key people who left the company 2 years ago
- News bullets with no specifics ("Company announced a new product")

---

## Edge Cases to Handle Gracefully

| Case | Handling |
|---|---|
| Private company | market_cap = null, note it's private |
| Very small/unknown company | Limited data is fine, don't fabricate |
| Gibberish input ("asdfgh") | 400 error, clear message to user |
| Company with multiple meanings (e.g., "Apple") | Research the most prominent/public company |
| Company with recent major event | That event should appear in news section |
| No key people found | Return empty array, don't crash |
| No financial data available | All fields null, note "Insufficient public data" |

---

## Glossary

| Term | Meaning |
|---|---|
| AE | Account Executive — closes deals |
| SDR | Sales Development Rep — qualifies leads, books meetings |
| ICP | Ideal Customer Profile — the type of company a rep sells to |
| ARR | Annual Recurring Revenue |
| YoY | Year over Year (growth comparison) |
| Section | One of the 5 report components: overview, key_people, news, financials, risks |
| Briefing | The complete 5-section report for one company |
| SSE | Server-Sent Events — the streaming protocol used |
| Stream | Real-time delivery of sections as they're generated |
| Report | Saved briefing in the database |