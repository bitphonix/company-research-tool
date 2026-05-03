# Company Research Tool

A sales intelligence tool that generates structured company briefings for Account Executives and SDRs. Enter a company name, an AI agent researches it using live web search, and streams a 5-section briefing in real time.

## Tech Stack

- **Backend:** FastAPI (Python), SQLite + SQLAlchemy + Alembic
- **Frontend:** React + TypeScript + Tailwind CSS (Vite)
- **LLM:** GPT-4.1 (OpenAI) — chosen for reliable structured output and fast tool-calling
- **Search:** Tavily — chosen for agent-native design, pre-processed results, and free tier

## Prerequisites

- Python 3.10+
- Node.js 18+

## Installation & Running

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### Environment Variables

Create `backend/.env`:

OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
DATABASE_URL=sqlite+aiosqlite:///./research.db

Get API keys:
- OpenAI: https://platform.openai.com/api-keys
- Tavily: https://app.tavily.com

## Running Tests

### Backend
```bash
cd backend
pytest tests/ -v
```

### Frontend
```bash
cd frontend
npm run test
```

## Trade-offs

- **Key people accuracy:** The agent may surface executives who have since left the company. Tavily search results reflect what's indexed, not necessarily current org charts. A production version would cross-reference LinkedIn or a people data API.
- **Gibberish input:** Invalid company names return a best-effort response rather than a hard error. The LLM handles this gracefully but may hallucinate data. A production version would add a company validation step before running the full agent.
- **SSE via fetch:** Standard `EventSource` doesn't support POST requests, so the frontend uses `fetch` with a `ReadableStream` reader. This achieves the same result but loses automatic reconnection. Acceptable for a POC.
- **Alembic URL hardcoded:** `alembic.ini` has a hardcoded SQLite URL. In production this would be driven by the environment variable.
- **No request cancellation on backend:** Cancelling a stream on the frontend closes the connection but the backend agent continues running until complete. A production version would use background task cancellation.

## What I'd Do Differently With More Time

- Add company validation before running the full agent pipeline
- Implement request cancellation on the backend using asyncio task management
- Add relative timestamps ("3 minutes ago") to report history
- Add Cmd/Ctrl+K keyboard shortcut to focus search
- Prevent duplicate concurrent research for the same company
- Move all environment config to pydantic-settings for type-safe configuration
- Add structured logging with request IDs for traceability