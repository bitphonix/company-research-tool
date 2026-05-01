# PRD — Company Research Tool (Sales Intelligence Briefing)

## Problem Statement
Sales reps spend 20–30 minutes per meeting doing manual company research. This tool
eliminates that by producing a structured, scannable briefing in under 2 minutes —
generated automatically by an AI agent using live web search.

## Target User
Account Executives and Sales Development Reps.
- Not technical
- Prepping between back-to-back calls
- Zero patience for broken states, slow UI, or confusing flows
- Need to walk into a meeting confident, not overwhelmed

## Core User Flow
1. Rep types a company name → hits Enter or clicks Search
2. AI agent researches the company using live web search
3. Report sections stream in real-time — rep sees progress, not a blank screen
4. Completed report is auto-saved to history
5. Rep can revisit, browse, or delete past reports from sidebar

---

## Report Sections (in order)

### 1. overview — Company Overview
- What the company does: industry, core products/services, target customers, positioning
- Written as a briefing, not a Wikipedia dump
- Rep's 30-second primer before walking in

### 2. key_people — Key People
- C-suite and senior leadership relevant to sales (CEO, CTO, CFO, CIO, CISO, etc.)
- Returned as array of `{ name: string, title: string }`
- Rep needs to know who they're talking to — it changes the entire conversation

### 3. news — Recent News
- 3–4 bullet points: acquisitions, earnings, launches, partnerships, layoffs, leadership changes
- MUST be sourced from live web search — no stale or hallucinated info
- Stale info is worse than no info

### 4. financials — Financial Highlights
- Fields: `{ revenue, employee_count, market_cap, yoy_growth }`
- Private companies → market_cap = null (never fabricate)
- Shapes how rep positions pricing and deal size

### 5. risks — Risk Factors
- 2–3 bullet points: regulatory, competitive threats, litigation, security breaches, instability
- What could blindside the rep in the meeting

---

## States the UI Must Handle
| State | Description |
|---|---|
| Empty | First-time user, no reports. Not blank — guide the user |
| Streaming | Research in progress. User sees sections appear progressively |
| Complete | Full report rendered |
| Error | Human-readable message. No stack traces |
| Invalid Input | Gibberish or empty input — handled gracefully |

---

## Nice-to-Haves (only after core is solid)
- Cancel in-progress research
- Visual indicator of which section is currently streaming
- Cmd/Ctrl+K to focus search
- Responsive layout
- Relative timestamps ("3 minutes ago")
- Prevent duplicate concurrent research for same company

## Out of Scope (DO NOT BUILD)
- Auth / login
- PDF export
- Dark mode / themes
- Pagination
- WebSockets (SSE only)
- Docker / containerization
- CI/CD
- Elaborate monitoring/logging

---

## Success Criteria
- Core flow works end-to-end
- UI respects all states (empty, streaming, error, complete, invalid)
- Code is readable, maintainable, proportional to problem
- API is clean with proper HTTP status codes
- Tests verify behavior (not implementation details)