import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy import select

from models.db_models import Base, ReportSection
from repositories.report_repository import (
    delete_report,
    get_all_reports,
    get_report_by_id,
    save_report,
)


@pytest_asyncio.fixture
async def session():
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        echo=False,
        connect_args={"check_same_thread": False},
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async_session_factory = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    async with async_session_factory() as session:
        yield session


@pytest.mark.asyncio
async def test_save_report_creates_rows(session: AsyncSession):
    sections = {
        "overview": "test overview",
        "key_people": "[]",
        "news": "[]",
        "financials": "{}",
        "risks": "[]",
    }
    
    report = await save_report(session, "Test Company", sections)
    
    assert report.id is not None
    assert report.company_name == "Test Company"
    assert len(report.sections) == 5
    
    # Verify in DB directly
    db_report = await get_report_by_id(session, report.id)
    assert db_report is not None
    assert len(db_report.sections) == 5


@pytest.mark.asyncio
async def test_get_all_reports_returns_newest_first(session: AsyncSession):
    # create oldest first
    await save_report(session, "Company 1", {"overview": "1"})
    await save_report(session, "Company 2", {"overview": "2"})
    
    reports = await get_all_reports(session)
    assert len(reports) == 2
    assert reports[0].company_name == "Company 2"
    assert reports[1].company_name == "Company 1"


@pytest.mark.asyncio
async def test_get_report_by_id_returns_with_sections(session: AsyncSession):
    saved_report = await save_report(session, "Load Test", {"overview": "content"})
    
    loaded_report = await get_report_by_id(session, saved_report.id)
    assert loaded_report is not None
    assert loaded_report.company_name == "Load Test"
    assert len(loaded_report.sections) == 1
    assert loaded_report.sections[0].section_key == "overview"
    assert loaded_report.sections[0].content == "content"


@pytest.mark.asyncio
async def test_get_report_by_id_returns_none_for_missing(session: AsyncSession):
    loaded_report = await get_report_by_id(session, 9999)
    assert loaded_report is None


@pytest.mark.asyncio
async def test_delete_report_returns_true_and_removes(session: AsyncSession):
    report = await save_report(session, "Delete Me", {"overview": "data"})
    
    success = await delete_report(session, report.id)
    assert success is True
    
    missing_report = await get_report_by_id(session, report.id)
    assert missing_report is None


@pytest.mark.asyncio
async def test_delete_report_returns_false_for_missing(session: AsyncSession):
    success = await delete_report(session, 9999)
    assert success is False


@pytest.mark.asyncio
async def test_delete_report_cascades_to_sections(session: AsyncSession):
    report = await save_report(session, "Cascade Delete", {"overview": "test cascade"})
    
    success = await delete_report(session, report.id)
    assert success is True
    
    # Check sections table directly
    result = await session.execute(
        select(ReportSection).where(ReportSection.report_id == report.id)
    )
    sections = result.scalars().all()
    assert len(sections) == 0
