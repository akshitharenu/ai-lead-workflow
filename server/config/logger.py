"""
Logger configuration using Python's built-in logging.
"""
import logging
import os
import sys

LOG_LEVEL = os.getenv("LOG_LEVEL", "info").upper()
LOG_FILE = os.getenv("LOG_FILE", "./logs/app.log")

os.makedirs(os.path.dirname(LOG_FILE) if os.path.dirname(LOG_FILE) else ".", exist_ok=True)

logger = logging.getLogger("ai-lead-workflow")
logger.setLevel(getattr(logging, LOG_LEVEL, logging.INFO))

# Console handler — colorized
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.DEBUG)
console_fmt = logging.Formatter(
    "[%(asctime)s] %(levelname)s [%(name)s] %(message)s",
    datefmt="%H:%M:%S",
)
console_handler.setFormatter(console_fmt)
logger.addHandler(console_handler)

# File handler
file_handler = logging.FileHandler(LOG_FILE, encoding="utf-8")
file_handler.setLevel(logging.DEBUG)
file_fmt = logging.Formatter(
    '{"time":"%(asctime)s","level":"%(levelname)s","module":"%(name)s","message":"%(message)s"}',
)
file_handler.setFormatter(file_fmt)
logger.addHandler(file_handler)
