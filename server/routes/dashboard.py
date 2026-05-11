"""
Dashboard API Routes — GET /api/dashboard/stats
"""
from fastapi import APIRouter
from config.database import get_db
from modules.crm import CRM

router = APIRouter()


@router.get("/stats")
async def get_stats():
    """Return CRM summary statistics for the dashboard."""
    db = get_db()
    try:
        return CRM.get_stats(db)
    finally:
        db.close()
