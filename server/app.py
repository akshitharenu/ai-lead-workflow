"""
FastAPI Application Factory
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from config.database import init_db
from config.logger import logger
from routes.leads import router as leads_router
from routes.dashboard import router as dashboard_router
from routes.health import router as health_router
from middleware.error_handler import register_error_handlers


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    logger.info("Database initialized successfully")
    yield
    # Shutdown
    logger.info("Server shutting down")


def create_app() -> FastAPI:
    app = FastAPI(
        title="AI Lead Workflow",
        description="AI-driven lead capture and intelligent response handling",
        version="1.0.0",
        lifespan=lifespan,
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Error handlers
    register_error_handlers(app)

    # Routes
    app.include_router(leads_router, prefix="/api/leads", tags=["Leads"])
    app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])
    app.include_router(health_router, prefix="/api/health", tags=["Health"])

    # Serve Static Files (Frontend)
    static_path = os.path.join(os.path.dirname(__file__), "public")
    if os.path.exists(static_path):
        app.mount("/", StaticFiles(directory=static_path, html=True), name="static")

        @app.get("/{full_path:path}")
        async def serve_frontend(full_path: str):
            # If the path doesn't start with /api, serve index.html (SPA routing)
            if not full_path.startswith("api"):
                return FileResponse(os.path.join(static_path, "index.html"))

    return app
