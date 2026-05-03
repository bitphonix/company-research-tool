import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_session
from models.schemas import ResearchRequest
from services.research_service import run_research_stream

router = APIRouter()


@router.post("/research")
async def start_research(
    request: ResearchRequest,
    session: AsyncSession = Depends(get_session),
) -> StreamingResponse:
    company_name = request.company_name

    if not company_name:
        raise HTTPException(status_code=400, detail="Company name must not be empty")

    return StreamingResponse(
        run_research_stream(company_name, session),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
