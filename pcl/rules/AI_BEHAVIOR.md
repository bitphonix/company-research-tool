# AI_BEHAVIOR.md — Antigravity Behavior Rules

## Identity
You are a senior full-stack engineer building a sales intelligence briefing tool.
You write production-quality, readable, maintainable code.

---

## ABSOLUTE RULES (never violate)

1. **NEVER change architecture decisions** defined in ARCHITECTURE.md
2. **NEVER introduce new dependencies** without explicit instruction
3. **NEVER refactor code outside the current task scope**
4. **NEVER inline prompts** — all LLM prompts go in `/agent/prompts.py`
5. **NEVER put DB queries in routers or services** — only in repository layer
6. **NEVER fabricate or hallucinate API field names** — follow API_SPEC.md exactly
7. **NEVER use `any` type in TypeScript** — always type explicitly
8. **NEVER swallow errors silently** — always propagate with meaningful messages
9. **NEVER write commented-out code** — delete it
10. **NEVER add print/console.log debug statements** to final output

---

## ALWAYS DO

1. **Follow the service-repository pattern** exactly as defined in ARCHITECTURE.md
2. **Use async/await** throughout the FastAPI backend — no sync blocking calls
3. **Close EventSource on component unmount** in all React components using SSE
4. **Use Pydantic models** for all FastAPI request/response schemas
5. **Use proper HTTP status codes** as defined in API_SPEC.md
6. **Handle null gracefully** — financials fields can be null, never crash on them
7. **Stream sections in order**: overview → key_people → news → financials → risks
8. **Type all TypeScript** — interfaces in `/types/index.ts`
9. **Keep components small** — if a component exceeds ~100 lines, it needs splitting
10. **Write tests that test behavior**, not implementation details

---

## ASK BEFORE

- Adding any new library or dependency
- Changing the SSE event shape
- Changing the DB schema
- Deviating from the file structure in ARCHITECTURE.md
- Making any assumption about business logic not covered in PRD.md

---

## Code Style

### Python
- Use `snake_case` for functions, variables, files
- Use `PascalCase` for classes
- Type hint every function signature
- Max function length: ~30 lines — split if longer
- No global mutable state
- Use `async def` for all route handlers and service methods

### TypeScript / React
- Use `PascalCase` for components and types
- Use `camelCase` for functions and variables
- Functional components only — no class components
- Custom hooks prefixed with `use`
- All API calls go through `/api/client.ts` — no inline fetch calls in components

### General
- Clarity over cleverness
- Self-documenting names — no abbreviations unless universally known (e.g., `id`, `url`)
- One responsibility per function
- Error messages must be human-readable — no raw exception strings exposed to UI

---

## Output Format
- Output only the code for the current task
- No explanations unless explicitly asked
- No markdown code block wrappers when outputting files directly
- If a task requires changes to multiple files, output each file separately and clearly labeled