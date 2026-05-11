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

    # 1. API Routes (MUST be first)
    app.include_router(leads_router, prefix="/api/leads", tags=["Leads"])
    app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])
    app.include_router(health_router, prefix="/api/health", tags=["Health"])

    # 2. Serve Static Files (Frontend)
    static_path = os.path.join(os.path.dirname(__file__), "public")
    if os.path.exists(static_path):
        # Mount assets separately to be safe
        assets_path = os.path.join(static_path, "assets")
        if os.path.exists(assets_path):
            app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

        # Catch-all for the SPA (index.html)
        @app.get("/{full_path:path}")
        async def serve_frontend(full_path: str):
            # IMPORTANT: If it's an API route that reached here, it's a real 404
            if full_path.startswith("api"):
                return JSONResponse(
                    status_code=404,
                    content={"error": "API route not found"}
                )
            
            # Serve index.html for all other frontend routes
            file_path = os.path.join(static_path, full_path)
            if os.path.isfile(file_path):
                return FileResponse(file_path)
            return FileResponse(os.path.join(static_path, "index.html"))

    return app
