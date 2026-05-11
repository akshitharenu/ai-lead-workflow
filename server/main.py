"""
AI Lead Workflow — FastAPI Server Entry Point
"""
import uvicorn
from contextlib import asynccontextmanager
from app import create_app
from config.env import settings
from config.database import init_db
from config.logger import logger


app = create_app()


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.NODE_ENV == "development",
    )
