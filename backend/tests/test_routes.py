import json
from unittest.mock import AsyncMock, patch

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from db.database import get_session
from main import app
from models.db_models import Base


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
    async with async_session_factory() as session_instance:
        yield session_instance


@pytest_asyncio.fixture
async def client(session: AsyncSession):
    app.dependency_overrides[get_session] = lambda: session
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_health_returns_200(client: AsyncClient):
    response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_get_reports_empty(client: AsyncClient):
    response = await client.get("/api/reports")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_get_report_missing_404(client: AsyncClient):
    response = await client.get("/api/reports/999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_report_missing_404(client: AsyncClient):
    response = await client.delete("/api/reports/999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_research_empty_company_returns_error(client: AsyncClient):
    response = await client.post("/api/research", json={"company_name": " "})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_research_short_company_returns_error(client: AsyncClient):
    response = await client.post("/api/research", json={"company_name": "A"})
    assert response.status_code == 422


@pytest.mark.asyncio
@patch("routers.research.run_research_stream")
async def test_research_valid_company_streams(mock_run_research_stream, client: AsyncClient):
    async def mock_stream(*args, **kwargs):
        yield f"event: status\ndata: {json.dumps({'message': 'Starting...'})}\n\n"
        yield f"event: done\ndata: {json.dumps({'report_id': 1})}\n\n"

    mock_run_research_stream.side_effect = mock_stream

    response = await client.post("/api/research", json={"company_name": "Stripe"})
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/event-stream; charset=utf-8"
    assert response.headers["x-accel-buffering"] == "no"
    
    content = response.text
    assert "event: status" in content
    assert "event: done" in content
