from datetime import datetime, timezone
from typing import List

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.ext.asyncio import AsyncAttrs


class Base(AsyncAttrs, DeclarativeBase):
    pass


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    company_name: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
    )

    sections: Mapped[List["ReportSection"]] = relationship(
        "ReportSection",
        back_populates="report",
        cascade="all, delete-orphan",
    )


class ReportSection(Base):
    __tablename__ = "report_sections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    report_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("reports.id", ondelete="CASCADE"),
        nullable=False,
    )
    section_key: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    report: Mapped["Report"] = relationship("Report", back_populates="sections")
