# CODING_RULES.md — Engineering Standards

## Backend (Python / FastAPI)

### Structure
- Routers: HTTP only. Parse request → call service → return response. Nothing else.
- Services: Business logic and agent orchestration only. No HTTP, no raw SQL.
- Repositories: All DB access. Every query lives here. Return domain objects, not raw rows.
- Agent: LLM calls, tool calls, prompt assembly. Isolated from HTTP and DB concerns.

### FastAPI Specifics
- Use `APIRouter` in every router file, not `app` directly
- Use `Depends()` for DB session injection — never instantiate sessions manually in routes
- Use `StreamingResponse` with `text/event-stream` media type for SSE
- Always set `X-Accel-Buffering: no` header on SSE responses
- Use `HTTPException` for all HTTP errors — never return raw dicts with error keys

### SQLAlchemy
- Use declarative base models in `db_models.py`
- All relationships declared explicitly with `relationship()` and `back_populates`
- Use `cascade="all, delete-orphan"` on report → sections relationship
- Session lifecycle: open in dependency, close in finally block
- Never use `session.execute(raw_sql)` — use ORM query API

### Alembic
- Every schema change = new migration file
- Never edit existing migration files
- Migration message format: `verb_noun` (e.g., `create_reports_table`)

### Async
- All route handlers: `async def`
- All service methods: `async def`
- All repository methods: use `AsyncSession` from `sqlalchemy.ext.asyncio`
- Tavily calls: wrap in `asyncio.to_thread()` if SDK is sync
- OpenAI calls: use `AsyncOpenAI` client

### Error Handling
- Catch specific exceptions, never bare `except:`
- Agent errors → emit SSE error event, never crash the stream silently
- DB errors → log + raise HTTPException(500)
- Validation errors → HTTPException(400) with clear message

---

## Frontend (React / TypeScript)

### Component Rules
- One component per file
- File name = component name (PascalCase)
- No business logic in components — extract to hooks
- Props interfaces defined in same file, above component
- Default exports for components, named exports for hooks and utilities

### TypeScript
- No `any` — ever
- No `as` type casting unless absolutely unavoidable (add comment explaining why)
- All API response shapes typed in `/types/index.ts`
- Use `interface` for object shapes, `type` for unions and primitives

### State Management
- Global state: AppContext with useReducer
- Local UI state: useState within component
- No prop drilling beyond 2 levels — lift to context
- Reducer actions: typed discriminated union

### API Calls
- All fetch logic in `/api/client.ts`
- Functions return typed promises
- Handle network errors at call site, not in components
- SSE lifecycle managed in `useSSE.ts` hook only

### SSE Hook Rules (critical)
```typescript
// useSSE.ts must:
// 1. Create EventSource on mount / trigger
// 2. Close EventSource on unmount (return cleanup fn from useEffect)
// 3. Handle 'section', 'status', 'done', 'error' events
// 4. Never leave dangling EventSource connections
```

### Styling (Tailwind)
- No inline styles
- No custom CSS files unless Tailwind cannot handle it
- Responsive classes used where layout changes at breakpoints
- Use semantic color names from tailwind config, not raw hex

---

## Testing

### Backend Tests (pytest)
- Mock OpenAI and Tavily — never hit real APIs in tests
- Test service behavior, not implementation
- Test all SSE event types are emitted correctly
- Test repository CRUD operations with in-memory SQLite
- Test HTTP status codes on all endpoints
- File naming: `test_[module].py`

### Frontend Tests (Vitest + React Testing Library)
- Test component behavior (what user sees), not internal state
- Mock `fetch` and `EventSource`
- Test all UI states: empty, streaming, complete, error
- Test that EventSource is closed on unmount
- No snapshot tests

### What NOT to Test
- Library internals (SQLAlchemy, OpenAI SDK)
- Trivial getters/setters
- CSS classes or styling

---

## Git Commit Format
```
scope: short description

Examples:
db: add reports and sections tables
agent: implement section streaming pipeline  
api: add POST /api/research SSE endpoint
ui: add streaming report component
fix: close EventSource on component unmount
```

## What Never Goes in Git
- `.env` files
- `research.db`
- `node_modules/`
- `__pycache__/`
- `.venv/`
- Any API key, anywhere