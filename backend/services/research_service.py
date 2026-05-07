import json
from collections.abc import AsyncGenerator

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from agent.agent import stream_research
from repositories.report_repository import save_report


def _sse_line(event: str, data: object) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


async def run_research_stream(
    company_name: str,
    session: AsyncSession,
    request: Request,
) -> AsyncGenerator[str, None]:
    collected_sections: dict[str, str] = {}

    async for event in stream_research(company_name):
        if await request.is_disconnected():
            return

        event_type = event["event"]
        event_data = event["data"]

        yield _sse_line(event_type, event_data)

        if event_type == "section":
            data = event_data
            section_key = data["section"]
            content = data["content"]
            collected_sections[section_key] = json.dumps(content)

        if event_type == "error":
            return

    if await request.is_disconnected():
        return

    try:
        report = await save_report(session, company_name, collected_sections)
        yield _sse_line("done", {"report_id": report.id})
    except Exception as exc:
        yield _sse_line("error", {"message": f"Failed to save report: {exc}"})
