# ARCHITECTURE.md — Company Research Tool

## STRICT RULE
> No architecture decision may be changed without explicit human instruction.
> AI must not refactor, restructure, or introduce new patterns beyond what is defined here.

---

## Stack

| Layer | Technology | Notes |
|---|---|---|
| LLM | GPT-4.1 (`gpt-4.1`) | Via OpenAI Python SDK |
| Search | Tavily Search API | `tavily-python` SDK |
| Backend | FastAPI (Python) | Async, SSE streaming |
| Data Layer | SQLite + SQLAlchemy + Alembic | SQLite file, ORM models, migration history |
| Frontend | React + TypeScript | Vite scaffold |
| Styling | TailwindCSS | Utility-first, no component libraries |
| State | React Context + useReducer | No Redux, no Zustand |

---

## Backend Architecture

### Pattern: Service Layer + Repository

```
FastAPI Router
    └── Service Layer         (business logic, agent orchestration)
        └── Repository Layer  (all DB queries live here, nowhere else)
            └── SQLAlchemy Models
                └── SQLite file (research.db)
```

- **Routers** handle HTTP concerns only: parse request, call service, return response
- **Services** own business logic: agent execution, section streaming, saving reports
- **Repositories** own all DB access: no raw SQL outside repository files
- **No global state** anywhere in backend

### Agent Pipeline

```
POST /api/research
    └── ResearchService.run(company_name)
        ├── search_tool(query)       ← Tavily
        ├── search_tool(query)       ← Tavily (multiple queries per section)
        └── llm_call(search_results) ← GPT-4.1
            └── stream section → SSE event → frontend
```

Each section is researched and streamed independently:
1. overview → stream
2. key_people → stream
3. news → stream
4. financials → stream
5. risks → stream

On completion → auto-save full report to SQLite via repository.

### SSE Event Shape

```json
// Section streaming
{ "event": "section", "data": { "section": "overview", "content": "..." } }

// Status updates
{ "event": "status", "data": { "message": "Researching key people..." } }

// Done
{ "event": "done", "data": { "report_id": 123 } }

// Error
{ "event": "error", "data": { "message": "Human-readable error message" } }
```

---

## Database Schema

### Table: reports
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | Auto-increment |
| company_name | TEXT NOT NULL | As entered by user |
| created_at | DATETIME | UTC, auto-set |

### Table: report_sections
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | Auto-increment |
| report_id | INTEGER FK | → reports.id, CASCADE DELETE |
| section_key | TEXT NOT NULL | one of: overview, key_people, news, financials, risks |
| content | TEXT NOT NULL | JSON string for structured sections, plain text for prose |

---

## Frontend Architecture

### Component Tree
```
App
├── Layout
│   ├── Sidebar
│   │   ├── SearchBox          ← primary search input
│   │   └── ReportHistory      ← list of past reports, click to load, delete
│   └── MainPanel
│       ├── EmptyState         ← first-time / no selection
│       ├── StreamingReport    ← active research in progress
│       │   └── SectionCard (×5, renders as sections arrive)
│       └── CompletedReport    ← loaded from history
│           └── SectionCard (×5, all rendered)
```

### State Shape (useReducer)
```typescript
type AppState = {
  status: 'idle' | 'streaming' | 'complete' | 'error'
  currentReport: Report | null
  streamingSections: Partial<ReportSections>
  history: ReportSummary[]
  error: string | null
}
```

### Streaming Strategy
- `EventSource` API to consume SSE from `/api/research`
- Each `section` event → append to `streamingSections` in state
- Each `status` event → update status indicator
- `done` event → mark complete, trigger history refresh
- `error` event → set error state, show human-readable message
- On component unmount → `eventSource.close()` (critical — prevents memory leaks)

---

## File Structure

### Backend
```
/backend
  main.py                  ← FastAPI app entry point
  /routers
    research.py            ← POST /api/research (SSE)
    reports.py             ← GET/DELETE /api/reports
    health.py              ← GET /api/health
  /services
    research_service.py    ← agent orchestration + streaming logic
  /repositories
    report_repository.py   ← all DB queries
  /models
    db_models.py           ← SQLAlchemy ORM models
    schemas.py             ← Pydantic request/response schemas
  /agent
    agent.py               ← GPT-4.1 + Tavily agent logic
    tools.py               ← Tavily search tool wrapper
    prompts.py             ← all LLM prompts (never inline)
  /db
    database.py            ← SQLAlchemy engine + session
    migrations/            ← Alembic migration files
  alembic.ini
  requirements.txt
  .env.example
```

### Frontend
```
/frontend
  /src
    /components
      SearchBox.tsx
      Sidebar.tsx
      ReportHistory.tsx
      SectionCard.tsx
      StreamingReport.tsx
      CompletedReport.tsx
      EmptyState.tsx
      ErrorState.tsx
      StatusIndicator.tsx
    /hooks
      useSSE.ts            ← EventSource lifecycle management
      useReports.ts        ← history fetch, delete
    /types
      index.ts             ← all shared TypeScript types
    /api
      client.ts            ← all fetch calls, typed
    /context
      AppContext.tsx        ← useReducer state + dispatch
    App.tsx
    main.tsx
  index.html
  tailwind.config.js
  tsconfig.json
  package.json
  vite.config.ts
```

---

## API Contracts

### POST /api/research
- Body: `{ "company_name": "Stripe" }`
- Response: SSE stream (Content-Type: text/event-stream)
- Errors: 400 (empty/invalid input), 500 (agent failure)

### GET /api/reports
- Response: `[{ id, company_name, created_at }]` newest first
- 200 always (empty array if none)

### GET /api/reports/{id}
- Response: `{ id, company_name, created_at, sections: { overview, key_people, news, financials, risks } }`
- 404 if not found

### DELETE /api/reports/{id}
- Response: 204 No Content
- 404 if not found

### GET /api/health
- Response: `{ "status": "ok" }`

---

## Environment Variables
```
OPENAI_API_KEY=
TAVILY_API_KEY=
DATABASE_URL=sqlite:///./research.db
```