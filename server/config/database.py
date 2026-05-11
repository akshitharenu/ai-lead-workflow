"""
SQLite Database — synchronous via Python's built-in sqlite3.
No native compilation required.
"""
import sqlite3
import os
from config.env import settings
from config.logger import logger

_connection = None


def get_db_path():
    """Resolve database path relative to server directory."""
    db_path = settings.DATABASE_PATH
    if not os.path.isabs(db_path):
        db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), db_path)
    return db_path


def init_db():
    """Create tables if they don't exist."""
    db_path = get_db_path()
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS leads (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            company TEXT NOT NULL,
            role TEXT,
            message TEXT,
            score INTEGER,
            tier TEXT,
            intent TEXT,
            ai_summary TEXT,
            ai_reasoning TEXT,
            routing_queue TEXT,
            routing_priority TEXT,
            routing_sla TEXT,
            email_response TEXT,
            pipeline_duration_ms INTEGER,
            status TEXT DEFAULT 'active',
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS pipeline_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lead_id TEXT NOT NULL,
            stage TEXT NOT NULL,
            status TEXT NOT NULL,
            data TEXT,
            duration_ms INTEGER,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS activity_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lead_id TEXT,
            level TEXT NOT NULL,
            module TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );
    """)
    conn.commit()
    conn.close()
    logger.info("SQLite database & tables ready")


def get_db():
    """Return a new connection. Caller must close it."""
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn
