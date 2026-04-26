"""Centralized config: paths, connection params, env loading."""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[2]

# Always load .env from the project root, regardless of cwd.
load_dotenv(PROJECT_ROOT / ".env")

DATA_DIR = PROJECT_ROOT / "data"
RAW_DIR = DATA_DIR / "raw"
CLEAN_DIR = DATA_DIR / "clean"
CHARTS_DIR = PROJECT_ROOT / "charts"

for d in (RAW_DIR, CLEAN_DIR, CHARTS_DIR):
    d.mkdir(parents=True, exist_ok=True)


def pg_conn_kwargs() -> dict[str, str | int]:
    """Return psycopg-compatible kwargs from environment."""
    missing = [
        k
        for k in (
            "SUPABASE_PG_HOST",
            "SUPABASE_PG_PORT",
            "SUPABASE_PG_DATABASE",
            "SUPABASE_PG_USER",
            "SUPABASE_PG_PASSWORD",
        )
        if not os.environ.get(k)
    ]
    if missing:
        raise RuntimeError(
            f"Missing env vars: {missing}. Copy .env.example → .env and fill in."
        )
    return {
        "host": os.environ["SUPABASE_PG_HOST"],
        "port": int(os.environ["SUPABASE_PG_PORT"]),
        "dbname": os.environ["SUPABASE_PG_DATABASE"],
        "user": os.environ["SUPABASE_PG_USER"],
        "password": os.environ["SUPABASE_PG_PASSWORD"],
        "sslmode": "require",
        # Reasonable default timeouts so a slow query doesn't hang the script.
        "options": "-c statement_timeout=180000",
    }
