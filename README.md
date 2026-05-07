# Company Research Tool

> AI-powered sales intelligence briefings. Enter a company name — get a structured, streaming briefing in under 2 minutes.

Built for Account Executives and SDRs who prep for 5–10 meetings a day and can't afford to walk in blind.

---

## What It Does

A sales rep types a company name. An AI agent searches the web in real time, synthesizes the results, and streams a 5-section briefing:

| Section | Purpose |
|---|---|
| **Executive Overview** | What the company does, in plain English |
| **Key People** | C-suite and senior leadership relevant to the conversation |
| **Recent News** | 3–4 current, specific bullets from live web search |
| **Financial Highlights** | Revenue, headcount, market cap, YoY growth |
| **Risk Factors** | What might come up and catch the rep off guard |

Every report is auto-saved and accessible from the history sidebar.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| **LLM** | GPT-4.1 (OpenAI) | Fast, reliable structured output, native async tool-calling. Non-reasoning model intentional — speed over depth for this use case |
| **Search** | Tavily | Built agent-native from day one. Returns pre-processed, relevance-ranked snippets ready to feed directly into the LLM. 1,000 free credits/month |
| **Backend** | FastAPI (Python) | Async-first, native SSE streaming, minimal boilerplate |
| **Database** | SQLite + SQLAlchemy + Alembic | Zero infrastructure, async ORM, full migration history |
| **Frontend** | React + TypeScript + Vite | Type-safe, fast HMR, Tailwind for styling |
| **Streaming** | Server-Sent Events (SSE) | One-way server push, no WebSocket overhead |

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- OpenAI API key → https://platform.openai.com/api-keys
- Tavily API key → https://app.tavily.com

---

## Installation & Running

### 1. Clone and set up environment variables

```bash
git clone https://github.com/bitphonix/company-research-tool.git
cd company-research-tool
```

Create `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
DATABASE_URL=sqlite+aiosqlite:///./research.db
```

### 2. Start the backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

> The Vite dev server proxies `/api` requests to the backend automatically — no CORS configuration needed.

---

## API Reference

### `POST /api/research`
Kicks off AI agent research. Streams results via SSE.

**Request**
```json
{ "company_name": "Stripe" }
```

**SSE Event Stream**
```
event: status
data: {"message": "Researching company overview..."}

event: section
data: {"section": "overview", "content": "Stripe is a..."}

event: section
data: {"section": "key_people", "content": [{"name": "Patrick Collison", "title": "CEO"}]}

event: section
data: {"section": "news", "content": ["Stripe launched...", "Stripe acquired..."]}

event: section
data: {"section": "financials", "content": {"revenue": "$14B", "employee_count": "8,000+", "market_cap": null, "yoy_growth": "~25%"}}

event: section
data: {"section": "risks", "content": ["Regulatory scrutiny...", "Competition from..."]}

event: done
data: {"report_id": 42}
```

**Errors**
| Code | When |
|---|---|
| `400` | Empty or invalid company name |
| `422` | Validation error (name < 2 or > 100 chars) |
| `500` | Unexpected server error |

---

### `GET /api/reports`
Returns all saved reports, newest first.

**Response `200`**
```json
[
  { "id": 42, "company_name": "Stripe", "created_at": "2026-05-03T10:23:00Z" },
  { "id": 41, "company_name": "Notion", "created_at": "2026-05-03T09:10:00Z" }
]
```

---

### `GET /api/reports/{id}`
Returns a full report with all sections.

**Response `200`**
```json
{
  "id": 42,
  "company_name": "Stripe",
  "created_at": "2026-05-03T10:23:00Z",
  "sections": {
    "overview": "Stripe is a...",
    "key_people": [{ "name": "Patrick Collison", "title": "CEO" }],
    "news": ["Stripe launched...", "Stripe raised..."],
    "financials": { "revenue": "$14B", "employee_count": "8,000+", "market_cap": null, "yoy_growth": "~25%" },
    "risks": ["Regulatory scrutiny...", "Competition from..."]
  }
}
```

**Response `404`** — Report not found

---

### `DELETE /api/reports/{id}`
Deletes a report and all its sections (cascade).

**Response `204`** — Deleted  
**Response `404`** — Not found

---

### `GET /api/health`
```json
{ "status": "ok" }
```

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Frontend                        │
│  React + TypeScript                                 │
│  AppContext (useReducer) → single source of truth   │
│  useSSE hook → fetch + ReadableStream (not          │
│    EventSource, which doesn't support POST)         │
│  useReports hook → history CRUD                     │
└─────────────────┬───────────────────────────────────┘
                  │ SSE stream + REST
┌─────────────────▼───────────────────────────────────┐
│                     Backend                         │
│  FastAPI Router → Service → Repository              │
│                                                     │
│  ResearchService                                    │
│    └── Agent (GPT-4.1 + Tavily)                     │
│         ├── 2 Tavily searches per section           │
│         ├── GPT-4.1 synthesizes results             │
│         └── Yields SSE events section by section   │
│                                                     │
│  ReportRepository → SQLAlchemy → SQLite             │
└─────────────────────────────────────────────────────┘
```

**Pattern:** Service Layer + Repository. Routers handle HTTP only. Services own business logic. Repositories own all DB access. Agent is isolated from HTTP and DB concerns.

---

## Agent Pipeline

Each of the 5 sections is researched independently in sequence:

```
For each section:
  1. Run 2 targeted Tavily searches
  2. Concatenate search result snippets
  3. Send to GPT-4.1 with section-specific prompt
  4. Parse and validate response (JSON for structured sections)
  5. Emit SSE section event → frontend renders immediately
  6. Move to next section

On completion:
  7. Save full report to SQLite
  8. Emit SSE done event with report_id
```

Sections stream in order: overview → key_people → news → financials → risks — matching the rep's mental prep sequence.

---

## UI States

| State | Trigger | Experience |
|---|---|---|
| **Empty** | First visit, no history | Typography-first landing, guides user |
| **Streaming** | Research in progress | Sections appear progressively. Active section highlighted in blue with pulsing indicator. Pending sections dimmed. |
| **Complete** | All sections done | Full report with company name as hero element |
| **Error** | API failure or network error | Human-readable message, dismiss and retry |
| **Invalid input** | < 2 chars or whitespace only | Blocked at input level |

---

## Additional Features Implemented

- ✅ **Visual streaming indicator** — active section highlighted blue with pulsing dot, pending sections dimmed
- ✅ **Responsive layout** — adapts from mobile to widescreen
- ✅ **Relative timestamps** — "3 minutes ago", "2 hours ago"
- ✅ **Cmd/Ctrl+K** — focuses search input from anywhere
- ✅ **Duplicate prevention** — same company can't be researched concurrently
- ✅ **Cancel research** — frontend AbortController aborts the fetch stream, backend detects client disconnect and stops processing

---

## Running Tests

### Backend (pytest)
```bash
cd backend
pytest tests/ -v
```
14 tests — repository CRUD, HTTP status codes, SSE streaming, input validation. External APIs fully mocked.

### Frontend (Vitest)
```bash
cd frontend
npm run test
```
8 tests — reducer state transitions covering all action types and edge cases.

---

## Trade-offs

**SSE via `fetch` + `ReadableStream` instead of `EventSource`**
Standard `EventSource` doesn't support POST requests. The frontend uses `fetch` with a manual stream reader, which achieves identical results but loses automatic reconnection on disconnect. Acceptable for a POC — a production version would either use GET with query params (enabling native EventSource) or add reconnection logic.

**Key people accuracy**
The agent returns whoever appears in current search results, which may include executives who have recently departed. A production version would cross-reference a people data API (LinkedIn, Clearbit) to verify current employment.

**Gibberish input handling**
Invalid company names (e.g. "asdfghjkl") return a best-effort response rather than a hard rejection. The LLM handles this gracefully but may hallucinate plausible-sounding data. A production version would add a company existence validation step before running the full agent pipeline.

**Alembic URL hardcoded**
`alembic.ini` has a hardcoded `sqlite:///./research.db` URL. In production this would be read from the environment variable via a script hook in `env.py`.

**Single-turn agent**
Each section makes independent LLM calls rather than using a multi-turn agentic loop. This is faster and more predictable for a POC but means sections can't reference or build on each other. A production version would use a proper agent framework (LangGraph, OpenAI Assistants) for cross-section coherence.

---

## What I'd Do Differently With More Time

- **Company validation** — verify the company exists before running the full pipeline
- **People data API** — cross-reference key people with LinkedIn or Clearbit for accuracy
- **Pydantic-settings** — type-safe environment configuration instead of raw `os.environ`
- **Structured logging** — request IDs, timing per section, agent call traces
- **GET-based SSE** — switch to GET + query params to enable native `EventSource` with auto-reconnect
- **Multi-agent pipeline** — LangGraph for cross-section coherence and parallel section research
- **Rate limiting** — per-IP limits on the research endpoint
- **Report caching** — same company researched within 24hrs returns cached result

---

## Project Structure

```
company-research-tool/
├── backend/
│   ├── main.py                    # FastAPI app, CORS, lifespan
│   ├── routers/
│   │   ├── research.py            # POST /api/research (SSE)
│   │   ├── reports.py             # GET/DELETE /api/reports
│   │   └── health.py              # GET /api/health
│   ├── services/
│   │   └── research_service.py    # Orchestration + SSE formatting
│   ├── repositories/
│   │   └── report_repository.py   # All DB queries
│   ├── agent/
│   │   ├── agent.py               # GPT-4.1 + Tavily pipeline
│   │   ├── tools.py               # Tavily search wrapper
│   │   └── prompts.py             # All LLM prompts
│   ├── models/
│   │   ├── db_models.py           # SQLAlchemy ORM models
│   │   └── schemas.py             # Pydantic request/response schemas
│   ├── db/
│   │   ├── database.py            # Async engine + session
│   │   └── migrations/            # Alembic migration files
│   ├── tests/
│   │   ├── test_report_repository.py
│   │   └── test_routes.py
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    └── src/
        ├── components/            # UI components
        ├── hooks/                 # useSSE, useReports
        ├── context/               # AppContext + useReducer
        ├── api/                   # Typed fetch client
        ├── types/                 # Shared TypeScript interfaces
        └── utils/                 # formatRelativeTime
```