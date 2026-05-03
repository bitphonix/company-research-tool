import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_session
from models.schemas import FinancialsSchema, PersonSchema, ReportDetailResponse, ReportSectionsSchema, ReportSummary
from repositories.report_repository import delete_report, get_all_reports, get_report_by_id

router = APIRouter()

_VALID_SECTION_KEYS = {"overview", "key_people", "news", "financials", "risks"}


def _parse_sections(raw_sections: list) -> ReportSectionsSchema:
    section_map: dict[str, object] = {}

    for section in raw_sections:
        if section.section_key not in _VALID_SECTION_KEYS:
            continue
        try:
            section_map[section.section_key] = json.loads(section.content)
        except json.JSONDecodeError:
            section_map[section.section_key] = section.content

    financials_raw = section_map.get("financials")
    financials = FinancialsSchema(**financials_raw) if isinstance(financials_raw, dict) else None

    key_people_raw = section_map.get("key_people")
    key_people = (
        [PersonSchema(**p) for p in key_people_raw]
        if isinstance(key_people_raw, list)
        else None
    )

    return ReportSectionsSchema(
        overview=section_map.get("overview"),
        key_people=key_people,
        news=section_map.get("news"),
        financials=financials,
        risks=section_map.get("risks"),
    )


@router.get("/reports", response_model=list[ReportSummary])
async def list_reports(
    session: AsyncSession = Depends(get_session),
) -> list[ReportSummary]:
    reports = await get_all_reports(session)
    return [ReportSummary.model_validate(r) for r in reports]


@router.get("/reports/{report_id}", response_model=ReportDetailResponse)
async def get_report(
    report_id: int,
    session: AsyncSession = Depends(get_session),
) -> ReportDetailResponse:
    report = await get_report_by_id(session, report_id)

    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")

    sections = _parse_sections(report.sections)

    return ReportDetailResponse(
        id=report.id,
        company_name=report.company_name,
        created_at=report.created_at,
        sections=sections,
    )


@router.delete("/reports/{report_id}", status_code=204)
async def remove_report(
    report_id: int,
    session: AsyncSession = Depends(get_session),
) -> None:
    deleted = await delete_report(session, report_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Report not found")
