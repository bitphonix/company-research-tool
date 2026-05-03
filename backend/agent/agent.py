import json
import os
from collections.abc import AsyncGenerator

from openai import AsyncOpenAI

from agent import prompts
from agent.tools import search

_client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])

SectionEvent = dict[str, object]


async def _gather_search_results(company: str, section: str) -> str:
    queries = [
        q.format(company=company)
        for q in prompts.SEARCH_QUERIES[section]
    ]
    all_results: list[str] = []
    for query in queries:
        results = await search(query)
        all_results.extend(results)

    return "\n\n---\n\n".join(all_results)


async def _call_llm(prompt: str) -> str:
    response = await _client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    content = response.choices[0].message.content
    return content.strip() if content else ""


def _parse_section_content(section: str, raw: str) -> object:
    if section == "overview":
        return raw

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        if section == "key_people":
            return []
        if section == "news":
            return []
        if section == "risks":
            return []
        if section == "financials":
            return {
                "revenue": None,
                "employee_count": None,
                "market_cap": None,
                "yoy_growth": None,
            }
        return raw


async def research_section(
    company_name: str,
    section: str,
) -> object:
    search_results = await _gather_search_results(company_name, section)
    prompt = prompts.SECTION_PROMPTS[section].format(
        company_name=company_name,
        search_results=search_results,
    )
    raw = await _call_llm(prompt)
    return _parse_section_content(section, raw)


async def stream_research(
    company_name: str,
) -> AsyncGenerator[SectionEvent, None]:
    for section in prompts.SECTION_ORDER:
        yield {"event": "status", "data": {"message": prompts.STATUS_MESSAGES[section]}}

        try:
            content = await research_section(company_name, section)
            yield {"event": "section", "data": {"section": section, "content": content}}
        except Exception as exc:
            yield {
                "event": "error",
                "data": {"message": f"Failed to research {section}: {exc}"},
            }
            return
