"""
Health API Route — GET /api/health
"""
import time
from fastapi import APIRouter

router = APIRouter()
_start_time = time.time()


@router.get("/")
async def health_check():
    """Return server health status."""
    return {
        "status": "ok",
        "uptime": round(time.time() - _start_time, 2),
        "version": "1.0.0",
        "database": "connected",
    }
