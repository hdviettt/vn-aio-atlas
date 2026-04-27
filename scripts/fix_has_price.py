"""Targeted fix for the has_price extraction bug.

Strategy: instead of re-pulling the full organic_features set (which
stalled twice), pull only (keyword_result_id, url, fixed_has_price)
from SEONGON Supabase for the SERP IDs we already have in
atlas.organic_features. Lighter query (3 cols) → less likely to stall.

Then UPDATE atlas.organic_features.has_price using the corrected values.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import polars as pl
import psycopg
from psycopg.rows import dict_row
from rich.console import Console
from tqdm import tqdm

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from atlas.config import RAW_DIR, pg_conn_kwargs  # noqa: E402
from atlas.db import atlas_conn  # noqa: E402

console = Console()


def get_kr_ids_from_atlas() -> list[int]:
    """Get the distinct keyword_result_ids in atlas.organic_features."""
    with atlas_conn() as conn, conn.cursor() as cur:
        cur.execute(
            "SELECT DISTINCT keyword_result_id FROM atlas.organic_features ORDER BY 1"
        )
        return [r[0] for r in cur.fetchall()]


def pull_corrected_has_price(ids: list[int], chunk_size: int = 100) -> pl.DataFrame:
    """Pull (kr_id, url, has_price_fixed) from SEONGON for given IDs."""
    sql = """
    SELECT
        id AS keyword_result_id,
        item->>'url' AS url,
        (item ? 'price'
            AND jsonb_typeof(item->'price') NOT IN ('null')
            AND COALESCE(NULLIF(item->>'price', ''), NULL) IS NOT NULL) AS has_price
      FROM keyword_results,
           jsonb_array_elements(raw_api_result::jsonb -> 'items') AS item
     WHERE has_ai_overview = 1
       AND raw_api_result IS NOT NULL
       AND raw_api_result NOT LIKE '%%\\u0000%%'
       AND item->>'type' = 'organic'
       AND id = ANY(%s)
    """

    chunks: list[pl.DataFrame] = []
    pbar = tqdm(total=len(ids), desc="ids processed", unit="id")
    for i in range(0, len(ids), chunk_size):
        ids_chunk = ids[i : i + chunk_size]
        try:
            with psycopg.connect(**pg_conn_kwargs(), row_factory=dict_row) as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, (ids_chunk,))
                    rows = cur.fetchall()
        except psycopg.errors.QueryCanceled:
            console.log(f"  timeout at chunk {i}; halving")
            chunk_size = max(20, chunk_size // 2)
            continue
        if rows:
            chunks.append(pl.DataFrame(rows))
        pbar.update(len(ids_chunk))
    pbar.close()
    if not chunks:
        return pl.DataFrame()
    return pl.concat(chunks, how="vertical_relaxed")


def update_atlas_has_price(df: pl.DataFrame) -> int:
    """UPDATE atlas.organic_features.has_price using fixed values."""
    if df.is_empty():
        return 0
    out = RAW_DIR / "has_price_fix.parquet"
    df.write_parquet(out)
    console.log(f"  wrote corrected values to {out} ({len(df):,} rows)")

    # Bulk update via temp table + UPDATE FROM
    with atlas_conn() as conn, conn.cursor() as cur:
        cur.execute(
            """
            CREATE TEMP TABLE _has_price_fix (
                keyword_result_id integer NOT NULL,
                url text NOT NULL,
                has_price boolean NOT NULL
            ) ON COMMIT DROP
            """
        )
        # COPY into temp table
        from io import StringIO

        buf = StringIO()
        df.with_columns(
            pl.when(pl.col("has_price")).then(pl.lit("t")).otherwise(pl.lit("f")).alias("has_price")
        ).select("keyword_result_id", "url", "has_price").write_csv(
            buf, include_header=False, null_value=""
        )
        buf.seek(0)
        with cur.copy(
            "COPY _has_price_fix (keyword_result_id, url, has_price) FROM STDIN WITH (FORMAT CSV, NULL '')"
        ) as cp:
            cp.write(buf.read())

        cur.execute("CREATE INDEX ON _has_price_fix (keyword_result_id, url)")

        cur.execute(
            """
            UPDATE atlas.organic_features f
               SET has_price = h.has_price
              FROM _has_price_fix h
             WHERE h.keyword_result_id = f.keyword_result_id
               AND h.url = f.url
            """
        )
        updated = cur.rowcount
        console.log(f"  updated {updated:,} rows in atlas.organic_features")
        return updated


def main() -> None:
    if not os.environ.get("SUPABASE_PG_PASSWORD"):
        console.log(
            "[red]SUPABASE_PG_PASSWORD not set in env; load via .env automatically[/]"
        )
    console.log("[bold]Step 1[/] — get keyword_result_ids from atlas.organic_features")
    ids = get_kr_ids_from_atlas()
    console.log(f"  {len(ids):,} distinct SERP ids in atlas.organic_features")

    console.log("[bold]Step 2[/] — pull corrected has_price from SEONGON")
    fixed = pull_corrected_has_price(ids)
    console.log(f"  pulled {len(fixed):,} (kr_id, url, has_price) rows")

    console.log("[bold]Step 3[/] — update atlas.organic_features in place")
    updated = update_atlas_has_price(fixed)
    console.log(f"[green]Done[/] — {updated:,} rows updated")

    # Verify by recomputing the F9 has_price metric
    console.log("\n[bold]Verification[/] — corrected has_price rates:")
    with atlas_conn() as conn, conn.cursor() as cur:
        cur.execute(
            """
            SELECT
                100.0 * AVG(CASE WHEN has_price THEN 1 ELSE 0 END)::numeric(6,2) FILTER (WHERE url_cited)     AS pct_cited,
                100.0 * AVG(CASE WHEN has_price THEN 1 ELSE 0 END)::numeric(6,2) FILTER (WHERE NOT url_cited) AS pct_uncited,
                COUNT(*) FILTER (WHERE url_cited) AS n_cited,
                COUNT(*) FILTER (WHERE NOT url_cited) AS n_uncited
              FROM atlas.organic_features
            """
        )
        r = cur.fetchone()
        console.log(
            f"  cited has_price: {r[0]}% (n={r[2]:,})\n"
            f"  uncited has_price: {r[1]}% (n={r[3]:,})"
        )


if __name__ == "__main__":
    main()
