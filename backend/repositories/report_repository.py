from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.db_models import Report, ReportSection


async def save_report(
    session: AsyncSession,
    company_name: str,
    sections: dict[str, str],
) -> Report:
    report = Report(
        company_name=company_name,
        created_at=datetime.now(timezone.utc),
    )
    session.add(report)
    await session.flush()

    for section_key, content in sections.items():
        section = ReportSection(
            report_id=report.id,
            section_key=section_key,
            content=content,
        )
        session.add(section)

    await session.commit()
    await session.refresh(report)

    result = await session.execute(
        select(Report)
        .where(Report.id == report.id)
        .options(selectinload(Report.sections))
    )
    return result.scalar_one()


async def get_all_reports(session: AsyncSession) -> list[Report]:
    result = await session.execute(
        select(Report).order_by(Report.created_at.desc())
    )
    return list(result.scalars().all())


async def get_report_by_id(
    session: AsyncSession,
    report_id: int,
) -> Report | None:
    result = await session.execute(
        select(Report)
        .where(Report.id == report_id)
        .options(selectinload(Report.sections))
    )
    return result.scalar_one_or_none()


async def delete_report(
    session: AsyncSession,
    report_id: int,
) -> bool:
    result = await session.execute(
        select(Report).where(Report.id == report_id)
    )
    report = result.scalar_one_or_none()

    if report is None:
        return False

    await session.delete(report)
    await session.commit()
    return True
