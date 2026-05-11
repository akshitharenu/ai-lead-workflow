"""
Global error handler — catches ApiError and unknown exceptions.
"""
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from utils.api_error import ApiError
from config.logger import logger
import traceback


def register_error_handlers(app: FastAPI):
    @app.exception_handler(ApiError)
    async def api_error_handler(request: Request, exc: ApiError):
        logger.error(f"[{exc.code}] {exc.message}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                    "details": exc.details,
                }
            },
        )

    @app.exception_handler(Exception)
    async def generic_error_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled error: {exc}\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred",
                }
            },
        )
