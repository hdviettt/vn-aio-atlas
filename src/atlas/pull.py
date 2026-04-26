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


def pull_aio_refs_urls(chunk_size: int = 20_000) -> Path:
    """Per-reference: (keyword_result_id, ref_position, domain, url).

    More fine-grained than pull_aio_refs_domains — needed for URL-level
    matching against organic results in Section 4.
    """
    out = RAW_DIR / "aio_refs_urls.parquet"
    console.log(f"[bold]Pulling AIO ref URLs[/] -> {out}")
    sql = """
    SELECT id AS keyword_result_id,
           keyword,
           ref->>'position' AS ref_position,
           ref->>'domain'   AS ref_domain,
           ref->>'url'      AS ref_url
      FROM keyword_results,
           jsonb_array_elements(aio_references::jsonb) AS ref
     WHERE has_ai_overview = 1
       AND aio_references IS NOT NULL
       AND aio_references NOT LIKE '%%\\u0000%%'
       AND ref->>'url' IS NOT NULL
       AND id > %s
     ORDER BY id
     LIMIT %s
    """
    all_chunks: list[pl.DataFrame] = []
    last_id = 0
    pbar = tqdm(desc="ref rows pulled", unit="row")
    while True:
        with _connect() as conn, conn.cursor() as cur:
            cur.execute(sql, (last_id, chunk_size))
            rows = cur.fetchall()
        if not rows:
            break
        df = pl.DataFrame(rows)
        all_chunks.append(df)
        last_id = int(df["keyword_result_id"].max())
        pbar.update(len(df))
        if len(rows) < chunk_size:
            break
    pbar.close()
    full = pl.concat(all_chunks, how="vertical_relaxed") if all_chunks else pl.DataFrame()
    full.write_parquet(out)
    console.log(f"  wrote {len(full):,} reference rows")
    return out


def pull_organic_features(
    chunk_size: int = 100, sample_size: int | None = 10_000
) -> Path:
    """For AIO-positive SERPs, pull per-organic-result feature columns.

    Pulls one row per (keyword_result_id, organic_url). Each row carries
    title+description+breadcrumb text so rows are heavy.

    For a full pull (sample_size=None): ~1.5M rows, ~50 minutes.

    For a sampled pull (default sample_size=30,000 SERPs): ~300K rows,
    ~10 minutes. Statistically more than enough for cited-vs-uncited
    feature comparisons. Sampling is random across the entire AIO-positive
    population.
    """
    out = RAW_DIR / "organic_features.parquet"
    console.log(
        f"[bold]Pulling organic features[/] -> {out}  "
        f"(sample_size={sample_size if sample_size else 'FULL'})"
    )

    # Build a sampled id list once if sampling, else stream by id range.
    sampled_ids: list[int] | None = None
    if sample_size is not None:
        with _connect() as conn, conn.cursor() as cur:
            cur.execute(
                """
                SELECT id FROM keyword_results
                 WHERE has_ai_overview = 1
                   AND raw_api_result IS NOT NULL
                   AND raw_api_result NOT LIKE '%%\\u0000%%'
                 ORDER BY random()
                 LIMIT %s
                """,
                (sample_size,),
            )
            sampled_ids = [r["id"] for r in cur.fetchall()]
        console.log(f"  sampled {len(sampled_ids):,} SERP ids")

    sql_template = """
    SELECT
        id AS keyword_result_id,
        (item->>'rank_absolute')::int AS rank_absolute,
        item->>'domain'      AS domain,
        item->>'url'         AS url,
        item->>'title'       AS title,
        item->>'description' AS description,
        item->>'breadcrumb'  AS breadcrumb,
        LENGTH(COALESCE(item->>'title', ''))       AS title_length,
        LENGTH(COALESCE(item->>'description', '')) AS description_length,
        COALESCE((item->>'is_featured_snippet')::boolean, FALSE) AS is_featured_snippet,
        (jsonb_typeof(item->'links') = 'array'
            AND jsonb_array_length(item->'links') > 0)  AS has_sitelinks,
        (jsonb_typeof(item->'faq')         = 'object')  AS has_faq,
        (jsonb_typeof(item->'rating')      = 'object')  AS has_rating,
        -- "price" is sometimes a string, sometimes a number, sometimes null.
        -- Treat anything other than JSON null/missing as having a price.
        (item ? 'price' AND jsonb_typeof(item->'price') NOT IN ('null')
            AND COALESCE(NULLIF(item->>'price', ''), NULL) IS NOT NULL) AS has_price,
        (jsonb_typeof(item->'highlighted') = 'array'
            AND jsonb_array_length(item->'highlighted') > 0) AS has_highlighted
      FROM keyword_results,
           jsonb_array_elements(raw_api_result::jsonb -> 'items') AS item
     WHERE has_ai_overview = 1
       AND raw_api_result IS NOT NULL
       AND raw_api_result NOT LIKE '%%\\u0000%%'
       AND item->>'type' = 'organic'
       AND id = ANY(%s)
    """

    def _fetch_chunk(ids_chunk: list[int]) -> pl.DataFrame | None:
        with _connect() as conn, conn.cursor() as cur:
            cur.execute(sql_template, (ids_chunk,))
            rows = cur.fetchall()
        if not rows:
            return None
        return pl.DataFrame(rows)

    all_chunks: list[pl.DataFrame] = []
    pbar = tqdm(desc="organic rows pulled", unit="row")

    if sampled_ids is not None:
        # Incremental writes: spill every ~50 chunks so partial progress survives
        # any future stalls. Final pass concats all temp files into one parquet.
        tmp_dir = RAW_DIR / "_organic_features_tmp"
        tmp_dir.mkdir(exist_ok=True)
        # Clean any previous attempt
        for f in tmp_dir.glob("*.parquet"):
            f.unlink()

        for i in range(0, len(sampled_ids), chunk_size):
            ids_chunk = sampled_ids[i : i + chunk_size]
            try:
                df = _fetch_chunk(ids_chunk)
            except psycopg.errors.QueryCanceled:
                console.log(f"  timeout on chunk {i}; halving and retrying")
                chunk_size = max(20, chunk_size // 2)
                df = _fetch_chunk(ids_chunk[:chunk_size])
            if df is None:
                continue
            all_chunks.append(df)
            pbar.update(len(df))
            # Spill every 5K rows
            if sum(c.height for c in all_chunks) >= 5_000:
                spilled = pl.concat(all_chunks, how="vertical_relaxed")
                spilled.write_parquet(tmp_dir / f"chunk_{i:08d}.parquet")
                all_chunks = []
        if all_chunks:
            pl.concat(all_chunks, how="vertical_relaxed").write_parquet(
                tmp_dir / "chunk_final.parquet"
            )
            all_chunks = []
        # Reload all spilled chunks for the final write
        for f in sorted(tmp_dir.glob("*.parquet")):
            all_chunks.append(pl.read_parquet(f))
    else:
        # Full pull, stream by id ranges
        sql_full = sql_template.replace(
            "AND id = ANY(%s)", "AND id > %s ORDER BY id LIMIT %s"
        )
        last_id = 0
        while True:
            with _connect() as conn, conn.cursor() as cur:
                try:
                    cur.execute(sql_full, (last_id, chunk_size))
                    rows = cur.fetchall()
                except psycopg.errors.QueryCanceled:
                    chunk_size = max(200, chunk_size // 2)
                    continue
            if not rows:
                break
            df = pl.DataFrame(rows)
            all_chunks.append(df)
            last_id = int(df["keyword_result_id"].max())
            pbar.update(len(df))
            if len(rows) < chunk_size:
                break

    pbar.close()
    full = pl.concat(all_chunks, how="vertical_relaxed") if all_chunks else pl.DataFrame()
    full.write_parquet(out)
    console.log(f"  wrote {len(full):,} organic-result rows")
    return out


def pull_all() -> None:
    pull_projects()
    pull_meta()
    pull_aio_refs_domains()
    pull_organic_top10()
    pull_aio_refs_urls()
    pull_organic_features()


if __name__ == "__main__":
    pull_all()
