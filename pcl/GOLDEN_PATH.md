# GOLDEN_PATH.md — Execution Sequence

## How to Use This
Each phase = one Antigravity thread.
Never mix phases in a single thread.
Complete and verify each phase before starting the next.
Pin ARCHITECTURE.md + AI_BEHAVIOR.md + CODING_RULES.md in every thread.

---

## Phase 0 — Project Scaffold ✅ (PCL complete)
**Output:** All PCL files created
- [x] PRD.md
- [x] ARCHITECTURE.md
- [x] API_SPEC.md
- [x] AI_BEHAVIOR.md
- [x] CODING_RULES.md
- [x] DOMAIN_CONTEXT.md
- [x] GOLDEN_PATH.md

---

## Phase 1 — Backend Scaffold + DB
**Thread context:** ARCHITECTURE.md, CODING_RULES.md, AI_BEHAVIOR.md
**Atomic tasks (one prompt each):**
1. Create FastAPI project structure (folders + empty files + requirements.txt)
2. Create SQLAlchemy models (`db_models.py`) — reports + report_sections tables
3. Create database session setup (`database.py`) — async engine, session factory
4. Create Alembic config + initial migration (`create_reports_tables`)
5. Create repository layer (`report_repository.py`) — CRUD methods
6. Create Pydantic schemas (`schemas.py`) — request/response models

**Verify:** `alembic upgrade head` runs clean, `research.db` created with correct schema

---

## Phase 2 — Agent Pipeline
**Thread context:** ARCHITECTURE.md, API_SPEC.md, CODING_RULES.md, AI_BEHAVIOR.md, DOMAIN_CONTEXT.md
**Atomic tasks:**
1. Create Tavily search tool wrapper (`tools.py`)
2. Create all LLM prompts (`prompts.py`) — one prompt per section, system prompt
3. Create agent core (`agent.py`) — GPT-4.1 calls with Tavily tool use
4. Create research service (`research_service.py`) — orchestrates agent, yields SSE events

**Verify:** Mock test — agent runs against "Stripe", produces all 5 sections with correct shapes

---

## Phase 3 — API Endpoints
**Thread context:** ARCHITECTURE.md, API_SPEC.md, CODING_RULES.md, AI_BEHAVIOR.md
**Atomic tasks:**
1. Create health router (`health.py`)
2. Create reports router (`reports.py`) — GET /api/reports, GET /api/reports/{id}, DELETE /api/reports/{id}
3. Create research router (`research.py`) — POST /api/research with SSE streaming
4. Wire all routers in `main.py` with CORS config

**Verify:** All endpoints return correct status codes. SSE stream emits all event types.

---

## Phase 4 — Frontend Scaffold + State
**Thread context:** ARCHITECTURE.md, CODING_RULES.md, AI_BEHAVIOR.md
**Atomic tasks:**
1. Vite + React + TypeScript + Tailwind scaffold
2. Create all TypeScript types (`/types/index.ts`)
3. Create API client (`/api/client.ts`) — all fetch calls typed
4. Create AppContext + reducer (`/context/AppContext.tsx`) — full state shape + all actions
5. Create `useSSE.ts` hook — EventSource lifecycle, all event handlers, unmount cleanup
6. Create `useReports.ts` hook — fetch history, delete

**Verify:** TypeScript compiles clean. No `any` types.

---

## Phase 5 — Core UI Components
**Thread context:** ARCHITECTURE.md, CODING_RULES.md, AI_BEHAVIOR.md, DOMAIN_CONTEXT.md
**Atomic tasks:**
1. Create `SearchBox.tsx` — input + button, Enter key, validation, Cmd+K shortcut
2. Create `EmptyState.tsx` — guides first-time user, not blank
3. Create `SectionCard.tsx` — renders one section (handles all 5 data shapes)
4. Create `StatusIndicator.tsx` — which section is currently being researched
5. Create `StreamingReport.tsx` — renders sections as they arrive, shows status
6. Create `CompletedReport.tsx` — renders full saved report

**Verify:** All states render correctly with mock data

---

## Phase 6 — History + Layout
**Thread context:** ARCHITECTURE.md, CODING_RULES.md, AI_BEHAVIOR.md
**Atomic tasks:**
1. Create `ReportHistory.tsx` — list of past reports, relative timestamps, click to load
2. Create `Sidebar.tsx` — SearchBox + ReportHistory composed
3. Create `Layout.tsx` — sidebar + main panel, responsive
4. Wire everything in `App.tsx`

**Verify:** Full app renders, history loads, click report loads it, delete works

---

## Phase 7 — Edge Cases + Error States
**Thread context:** PRD.md, API_SPEC.md, CODING_RULES.md, DOMAIN_CONTEXT.md
**Atomic tasks:**
1. Handle empty/gibberish input (frontend validation + backend 400)
2. Handle stream error events in UI
3. Handle backend unreachable (network error in useSSE)
4. Handle component unmount during active stream (close EventSource)
5. Handle null financials fields in SectionCard
6. Handle missing sections gracefully (section not in response)
7. Handle rapid successive searches (cancel previous stream)

**Verify:** All edge cases tested manually + unit tests

---

## Phase 8 — Tests
**Thread context:** CODING_RULES.md, AI_BEHAVIOR.md
**Atomic tasks:**
1. Backend: `test_research_service.py` — mock OpenAI + Tavily, test SSE events emitted
2. Backend: `test_report_repository.py` — CRUD with in-memory SQLite
3. Backend: `test_routes.py` — HTTP status codes, response shapes
4. Frontend: `test_SearchBox.tsx` — input validation, submit behavior
5. Frontend: `test_AppContext.tsx` — reducer state transitions
6. Frontend: `test_useSSE.tsx` — EventSource lifecycle, unmount cleanup
7. Frontend: `test_SectionCard.tsx` — renders all 5 section types correctly

**Verify:** All tests pass. No tests hitting real APIs.

---

## Phase 9 — README + Cleanup
**Atomic tasks:**
1. Write README.md (install, run, API keys, trade-offs, what's next)
2. Create `.env.example`
3. Remove any debug logs, commented code
4. Final TypeScript compile check
5. Final Python type check (mypy or pyright)
6. Zip preparation (exclude node_modules, __pycache__, .venv, .env, research.db)

---

## Prompt Template for Each Atomic Task

```
Context files: [list which PCL files are pinned]

Task: [single atomic task]

Constraints:
- Follow ARCHITECTURE.md strictly
- Follow CODING_RULES.md
- Follow AI_BEHAVIOR.md

Current file being worked on: [filename]

Output: Only the file content. No explanation.
```

---

## Checkpoint After Each Phase
Before moving to next phase, verify:
- [ ] Code runs without errors
- [ ] Follows patterns in ARCHITECTURE.md
- [ ] No new dependencies added without instruction
- [ ] TypeScript compiles clean (frontend phases)
- [ ] Git commit made: `git commit -m "phase-N: description"`