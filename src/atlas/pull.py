"""Pull data from Supabase into local parquet files.

Strategy: pull only the columns each analysis needs, server-side-extract
where possible (avoid shipping multi-MB JSON blobs we don't need).

The four foundation analyses need:
1. Query length × AIO presence  -> META only
2. AIO ↔ organic top-10 overlap -> AIO refs (domains) + organic top-10 (domains)
3. Top cited domains            -> AIO refs (domains) only
4. AIO length over time         -> META (aio_md_len already computed server-side)

Output files (in data/raw/, gitignored):
    meta.parquet              — per-row metadata
    aio_refs_domains.parquet  — per-row list of cited AIO domains
    organic_top10.parquet     — per-row list of organic top-10 (domain, rank)
    projects.parquet          — project / brand metadata for joins
"""

from __future__ import annotations

import json
from pathlib import Path

import polars as pl
import psycopg
from psycopg.rows import dict_row
from rich.console import Console
from tqdm import tqdm

from atlas.config import RAW_DIR, pg_conn_kwargs

console = Console()


def _connect() -> psycopg.Connection:
    return psycopg.connect(**pg_conn_kwargs(), row_factory=dict_row)


def pull_projects() -> Path:
    """Pull the projects table — small, used for vertical tagging + anonymization."""
    out = RAW_DIR / "projects.parquet"
    console.log(f"[bold]Pulling projects[/] -> {out}")
    with _connect() as conn, conn.cursor() as cur:
        cur.execute(
            """
            SELECT id, name, brand_name, brand_domain,
                   location_code, language_code, created_at, user_id
              FROM projects
            """
        )
        rows = cur.fetchall()
    df = pl.DataFrame(rows)
    df.write_parquet(out)
    console.log(f"  wrote {len(df):,} project rows")
    return out


def pull_meta() -> Path:
    """Per-row metadata. Small. Drives most of the analysis."""
    out = RAW_DIR / "meta.parquet"
    console.log(f"[bold]Pulling meta[/] -> {out}")
    with _connect() as conn, conn.cursor() as cur:
        cur.execute(
            """
            SELECT id,
                   project_id,
                   session_id,
                   keyword,
                   has_ai_overview,
                   COALESCE(LENGTH(aio_markdown), 0) AS aio_md_len,
                   array_length(string_to_array(keyword, ' '), 1) AS keyword_token_count,
                   created_at
              FROM keyword_results
            """
        )
        rows = cur.fetchall()
    df = pl.DataFrame(rows)
    df.write_parquet(out)
    console.log(f"  wrote {len(df):,} rows · cols={df.columns}")
    return out


def pull_aio_refs_domains(chunk_size: int = 20_000) -> Path:
    """For AIO-positive rows, pull only the cited-domain list (not full URLs/text).

    Server-side jsonb extraction -> an array per row. Skips rows with null
    bytes that break jsonb parsing (~5% of rows).
    """
    out = RAW_DIR / "aio_refs_domains.parquet"
    console.log(f"[bold]Pulling AIO ref domains[/] -> {out}")

    sql = """
    SELECT id,
           keyword,
           project_id,
           created_at,
           ARRAY(
             SELECT DISTINCT ref->>'domain'
               FROM jsonb_array_elements(aio_references::jsonb) AS ref
              WHERE ref->>'domain' IS NOT NULL
           ) AS cited_domains
      FROM keyword_results
     WHERE has_ai_overview = 1
       AND aio_references IS NOT NULL
       AND aio_references NOT LIKE '%%\\u0000%%'
       AND id > %s
     ORDER BY id
     LIMIT %s
    """

    all_chunks: list[pl.DataFrame] = []
    last_id = 0
    pbar = tqdm(desc="rows pulled", unit="row")
    while True:
        with _connect() as conn, conn.cursor() as cur:
            cur.execute(sql, (last_id, chunk_size))
            rows = cur.fetchall()
        if not rows:
            break
        df = pl.DataFrame(rows)
        all_chunks.append(df)
        last_id = int(df["id"].max())
        pbar.update(len(df))
        if len(rows) < chunk_size:
            break
    pbar.close()

    full = pl.concat(all_chunks, how="vertical_relaxed") if all_chunks else pl.DataFrame()
    full.write_parquet(out)
    console.log(f"  wrote {len(full):,} AIO-positive rows")
    return out


def pull_organic_top10(chunk_size: int = 5_000) -> Path:
    """Per row: list of (domain, rank) for organic results in the top 10.

    Pulls only AIO-positive rows so we can compute overlap.
    """
    out = RAW_DIR / "organic_top10.parquet"
    console.log(f"[bold]Pulling organic top-10 domains[/] -> {out}")

    sql = """
    SELECT id,
           keyword,
           ARRAY(
             SELECT DISTINCT item->>'domain'
               FROM jsonb_array_elements(raw_api_result::jsonb -> 'items') AS item
              WHERE item->>'type' = 'organic'
                AND (item->>'rank_absolute')::int <= 10
                AND item->>'domain' IS NOT NULL
           ) AS top10_domains,
           jsonb_array_length(raw_api_result::jsonb -> 'items') AS total_items
      FROM keyword_results
     WHERE has_ai_overview = 1
       AND raw_api_result IS NOT NULL
       AND raw_api_result NOT LIKE '%%\\u0000%%'
       AND id > %s
     ORDER BY id
     LIMIT %s
    """

    all_chunks: list[pl.DataFrame] = []
    last_id = 0
    pbar = tqdm(desc="rows pulled", unit="row")
    while True:
        try:
            with _connect() as conn, conn.cursor() as cur:
                cur.execute(sql, (last_id, chunk_size))
                rows = cur.fetchall()
        except psycopg.errors.QueryCanceled as e:
            console.log(f"  query timeout at id>{last_id}: {e}; retrying smaller chunk")
            chunk_size = max(500, chunk_size // 2)
            continue
        if not rows:
            break
        df = pl.DataFrame(rows)
        all_chunks.append(df)
        last_id = int(df["id"].max())
        pbar.update(len(df))
        if len(rows) < chunk_size:
            break
    pbar.close()

    full = pl.concat(all_chunks, how="vertical_relaxed") if all_chunks else pl.DataFrame()
    full.write_parquet(out)
    console.log(f"  wrote {len(full):,} AIO-positive SERPs with organic top-10")
    return out


def pull_all() -> None:
    pull_projects()
    pull_meta()
    pull_aio_refs_domains()
    pull_organic_top10()


if __name__ == "__main__":
    pull_all()
