"""
Leads API Routes — POST /api/leads, GET /api/leads, GET /api/leads/:id
"""
from fastapi import APIRouter, Request, Query
from config.database import get_db
from config.logger import logger
from modules.orchestrator import run_pipeline
from modules.crm import CRM
from utils.api_error import ApiError
from pydantic import BaseModel, EmailStr
from typing import Optional

class LeadCreate(BaseModel):
    name: str
    email: str
    company: str
    role: Optional[str] = None
    message: Optional[str] = None

router = APIRouter()


@router.post("")
async def create_lead(lead_in: LeadCreate):
    """Run the full AI pipeline on a new lead submission."""
    db = get_db()
    try:
        # Convert pydantic model to dict for the pipeline
        body = lead_in.model_dump()
        
        result = run_pipeline(body, db)
        return result
    except ApiError as e:
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=e.status_code,
            content={
                "error": {
                    "code": e.code,
                    "message": e.message,
                    "details": e.details,
                }
            },
        )
    finally:
        db.close()


@router.get("")
async def list_leads(
    tier: str = Query(None),
    search: str = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    """List all leads with optional filtering and pagination."""
    db = get_db()
    try:
        result = CRM.get_all_leads(db, {"tier": tier, "search": search, "page": page, "limit": limit})
        return result
    finally:
        db.close()


@router.get("/{lead_id}")
async def get_lead(lead_id: str):
    """Get a single lead with all pipeline events."""
    db = get_db()
    try:
        lead = CRM.get_lead(lead_id, db)
        if not lead:
            from fastapi.responses import JSONResponse
            return JSONResponse(status_code=404, content={"error": "Lead not found"})
        return lead
    finally:
        db.close()
