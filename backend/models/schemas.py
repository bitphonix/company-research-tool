from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator, model_config


class ResearchRequest(BaseModel):
    company_name: str

    @field_validator("company_name")
    @classmethod
    def validate_company_name(cls, value: str) -> str:
        stripped = value.strip()
        if len(stripped) < 2 or len(stripped) > 100:
            raise ValueError("Company name must be between 2 and 100 characters")
        return stripped


class PersonSchema(BaseModel):
    name: str
    title: str


class FinancialsSchema(BaseModel):
    revenue: Optional[str] = None
    employee_count: Optional[str] = None
    market_cap: Optional[str] = None
    yoy_growth: Optional[str] = None


class ReportSectionsSchema(BaseModel):
    overview: Optional[str] = None
    key_people: Optional[list[PersonSchema]] = None
    news: Optional[list[str]] = None
    financials: Optional[FinancialsSchema] = None
    risks: Optional[list[str]] = None


class ReportSummary(BaseModel):
    model_config = model_config(from_attributes=True)

    id: int
    company_name: str
    created_at: datetime


class ReportDetailResponse(BaseModel):
    model_config = model_config(from_attributes=True)

    id: int
    company_name: str
    created_at: datetime
    sections: ReportSectionsSchema
