# GLOSSARY.md — Shared Vocabulary

## Business Domain

| Term | Definition |
|---|---|
| AE | Account Executive — senior sales rep who closes deals |
| SDR | Sales Development Rep — qualifies leads, books discovery calls |
| ICP | Ideal Customer Profile — the type of company being targeted |
| ARR | Annual Recurring Revenue — primary SaaS revenue metric |
| MRR | Monthly Recurring Revenue |
| YoY | Year over Year — growth comparison metric |
| Deal size | Estimated contract value, shaped by company financials |
| Value prop | Value proposition — why the product matters to this specific buyer |
| Discovery call | First sales meeting to understand prospect needs |
| Briefing | The complete 5-section research output for one company |
| Prospect | The company being researched |

---

## Technical

| Term | Definition |
|---|---|
| SSE | Server-Sent Events — one-way HTTP streaming from server to client |
| EventSource | Browser API for consuming SSE streams |
| Section | One of the 5 report components (overview, key_people, news, financials, risks) |
| Section key | String identifier: `overview`, `key_people`, `news`, `financials`, `risks` |
| Report | A saved briefing in the database — one row in `reports` table |
| Report sections | The 5 data rows in `report_sections` table linked to a report |
| Stream | Real-time delivery of section data as it's generated |
| Agent | The GPT-4.1 + Tavily pipeline that researches a company |
| Tool call | When the LLM invokes the Tavily search function |
| PCL | Project Control Layer — the /docs /rules /context files |
| Repository | Data access layer — all DB queries live here |
| Service | Business logic layer — orchestrates agent and repository |
| Router | HTTP layer — FastAPI route handlers |
| Schema | Pydantic model for request/response validation |
| ORM model | SQLAlchemy class mapping to a DB table |
| Migration | Alembic versioned DB schema change |

---

## SSE Event Types

| Event | When emitted | Data shape |
|---|---|---|
| `status` | Before each section begins | `{ message: string }` |
| `section` | When a section is complete | `{ section: SectionKey, content: any }` |
| `done` | When all sections complete and report saved | `{ report_id: number }` |
| `error` | On any failure during research | `{ message: string }` |

---

## Section Data Shapes

| Section key | Content type | Notes |
|---|---|---|
| `overview` | `string` | Prose, 2–4 sentences |
| `key_people` | `Array<{name: string, title: string}>` | Max 6 entries |
| `news` | `Array<string>` | 3–4 bullet strings |
| `financials` | `{revenue, employee_count, market_cap, yoy_growth}` | All fields nullable |
| `risks` | `Array<string>` | 2–3 bullet strings |

---

## UI States

| State | Trigger | What user sees |
|---|---|---|
| `idle` | App load, no history | EmptyState component |
| `streaming` | Search submitted | StreamingReport with progressive sections |
| `complete` | Done event received | CompletedReport fully rendered |
| `error` | Error event or network failure | ErrorState with human-readable message |
| `loading_history` | Clicking past report | Loading indicator, then CompletedReport |