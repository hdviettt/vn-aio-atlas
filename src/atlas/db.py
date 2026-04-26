"""Atlas analytical Postgres connection helper."""

from __future__ import annotations

import os
from contextlib import contextmanager
from typing import Iterator

import psycopg
from psycopg import Connection

from atlas.config import PROJECT_ROOT

# Re-export for callers that already imported from atlas.config
ATLAS_PG_URL_KEY = "ATLAS_PG_URL"


def get_atlas_pg_url() -> str:
    url = os.environ.get(ATLAS_PG_URL_KEY)
    if not url:
        raise RuntimeError(
            f"{ATLAS_PG_URL_KEY} is not set. See .env.example for setup instructions."
        )
    return url


@contextmanager
def atlas_conn() -> Iterator[Connection]:
    """Context-managed psycopg connection to the Atlas Postgres."""
    conn = psycopg.connect(get_atlas_pg_url(), autocommit=False)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def apply_schema(sql_path: str | None = None) -> None:
    """Apply DDL from sql/01_schema.sql. Drops & recreates the atlas schema."""
    sql_file = sql_path or str(PROJECT_ROOT / "sql" / "01_schema.sql")
    with open(sql_file, encoding="utf-8") as f:
        ddl = f.read()
    with atlas_conn() as conn, conn.cursor() as cur:
        cur.execute(ddl)
