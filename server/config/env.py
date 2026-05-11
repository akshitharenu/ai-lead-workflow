"""
Environment configuration — loads .env and validates required keys.
Uses a simple approach without pydantic-settings to avoid version conflicts.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

REQUIRED_KEYS = ["ANTHROPIC_API_KEY", "PORT", "DATABASE_PATH", "JWT_SECRET"]
missing = [k for k in REQUIRED_KEYS if not os.getenv(k)]
if missing:
    raise RuntimeError(f"CRITICAL STARTUP ERROR: Missing required env vars: {', '.join(missing)}")


class _Settings:
    """Frozen config object."""
    def __init__(self):
        self.ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
        self.USE_MOCK_AI = os.getenv("USE_MOCK_AI", "false").lower() == "true"
        self.PORT = int(os.getenv("PORT", "3001"))
        self.NODE_ENV = os.getenv("NODE_ENV", "development")
        self.DATABASE_PATH = os.getenv("DATABASE_PATH", "./data/crm.db")
        self.JWT_SECRET = os.getenv("JWT_SECRET")
        self.JWT_EXPIRES_IN = os.getenv("JWT_EXPIRES_IN", "7d")
        self.RATE_LIMIT_WINDOW_MS = int(os.getenv("RATE_LIMIT_WINDOW_MS", "60000"))
        self.RATE_LIMIT_MAX_REQUESTS = int(os.getenv("RATE_LIMIT_MAX_REQUESTS", "100"))
        self.LOG_LEVEL = os.getenv("LOG_LEVEL", "info")
        self.LOG_FILE = os.getenv("LOG_FILE", "./logs/app.log")


settings = _Settings()
