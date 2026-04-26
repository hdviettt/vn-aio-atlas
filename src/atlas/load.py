"""Load cleaned parquet data + computed findings into the Atlas Postgres.

Pipeline:
    1. Apply schema (DROP + CREATE atlas.*)
    2. Load atlas.projects (cleaned + vertical-tagged)
    3. Load atlas.keyword_results (231K rows from data/clean/meta.parquet)
    4. Load atlas.aio_citations (exploded from raw aio_refs_domains.parquet)
    5. Load atlas.organic_top10 (exploded from raw organic_top10.parquet)
    6. Compute & persist F1-F6 findings tables
    7. Insert run metadata

Idempotent: every run re-applies schema, so it always reflects the
latest cleaned data + findings.

Bulk loads use psycopg's COPY FROM STDIN for speed (~10x faster than
INSERT for 200K rows).
"""

from __future__ import annotations

from datetime import datetime
from io import StringIO

import polars as pl
from psycopg import Connection
from rich.console import Console

from atlas.clean import _vertical_for_domain
from atlas.config import CLEAN_DIR, RAW_DIR
from atlas.db import apply_schema, atlas_conn

console = Console()


def _copy_df(conn: Connection, df: pl.DataFrame, table: str, columns: list[str]) -> int:
    """Stream a polars DataFrame into Postgres via COPY FROM STDIN.

    Uses CSV format with explicit NULL marker. Booleans serialized as t/f.
    """
    if df.is_empty():
        return 0

    # Polars -> CSV in memory. Use null='' and qualify with explicit columns.
    buf = StringIO()
    # Booleans must come out as t/f for Postgres CSV mode.
    write_df = df
    for col in df.columns:
        if df[col].dtype == pl.Boolean:
            write_df = write_df.with_columns(
                pl.when(pl.col(col)).then(pl.lit("t")).otherwise(pl.lit("f")).alias(col)
            )
    write_df.write_csv(buf, include_header=False, null_value="")
    buf.seek(0)

    cols_sql = ", ".join(columns)
    copy_sql = f"COPY {table} ({cols_sql}) FROM STDIN WITH (FORMAT CSV, NULL '')"
    with conn.cursor() as cur:
        with cur.copy(copy_sql) as cp:
            cp.write(buf.read())
    return len(df)


def _truncate(conn: Connection, table: str) -> None:
    with conn.cursor() as cur:
        cur.execute(f"TRUNCATE {table} CASCADE")


def load_projects(conn: Connection) -> int:
    """Tag every project with a vertical and load."""
    projects = pl.read_parquet(RAW_DIR / "projects.parquet")
    tagged = projects.with_columns(
        pl.struct("brand_domain", "brand_name", "name")
        .map_elements(
            lambda s: _vertical_for_domain(s["brand_domain"], s["brand_name"], s["name"]),
            return_dtype=pl.String,
        )
        .alias("vertical")
    ).select(
        "id",
        "name",
        "brand_name",
        "brand_domain",
        "vertical",
        "location_code",
        "language_code",
        "created_at",
    )
    _truncate(conn, "atlas.projects")
    n = _copy_df(
        conn,
        tagged,
        "atlas.projects",
        [
            "id",
            "name",
            "brand_name",
            "brand_domain",
            "vertical",
            "location_code",
            "language_code",
            "created_at",
        ],
    )
    console.log(f"  atlas.projects: {n:,} rows")
    return n


def load_keyword_results(conn: Connection) -> int:
    meta = pl.read_parquet(CLEAN_DIR / "meta.parquet")
    # has_ai_overview was integer 0/1 in the source — coerce to boolean.
    out = meta.with_columns(
        (pl.col("has_ai_overview") == 1).alias("has_ai_overview"),
    ).select(
        "id",
        "project_id",
        "session_id",
        "keyword",
        "has_ai_overview",
        pl.col("aio_md_len").cast(pl.Int32),
        pl.col("keyword_token_count").cast(pl.Int32),
        "vertical",
        "created_at",
    )
    _truncate(conn, "atlas.keyword_results")
    n = _copy_df(
        conn,
        out,
        "atlas.keyword_results",
        [
            "id",
            "project_id",
            "session_id",
            "keyword",
            "has_ai_overview",
            "aio_md_len",
            "keyword_token_count",
            "vertical",
            "created_at",
        ],
    )
    console.log(f"  atlas.keyword_results: {n:,} rows")
    return n


def load_aio_citations(conn: Connection) -> int:
    refs = pl.read_parquet(RAW_DIR / "aio_refs_domains.parquet")
    # Restrict to rows that survived cleaning
    valid_ids = set(
        pl.read_parquet(CLEAN_DIR / "meta.parquet").select("id").to_series().to_list()
    )
    refs = refs.filter(pl.col("id").is_in(valid_ids))

    exploded = (
        refs.explode("cited_domains")
        .rename({"cited_domains": "domain", "id": "keyword_result_id"})
        .filter(pl.col("domain").is_not_null())
        .select("keyword_result_id", "domain")
        .unique()  # protect against any duplicates from the source
    )
    _truncate(conn, "atlas.aio_citations")
    n = _copy_df(
        conn, exploded, "atlas.aio_citations", ["keyword_result_id", "domain"]
    )
    console.log(f"  atlas.aio_citations: {n:,} rows")
    return n


def load_organic_top10(conn: Connection) -> int:
    org = pl.read_parquet(RAW_DIR / "organic_top10.parquet")
    valid_ids = set(
        pl.read_parquet(CLEAN_DIR / "meta.parquet").select("id").to_series().to_list()
    )
    org = org.filter(pl.col("id").is_in(valid_ids))

    exploded = (
        org.explode("top10_domains")
        .rename({"top10_domains": "domain", "id": "keyword_result_id"})
        .filter(pl.col("domain").is_not_null())
        .select("keyword_result_id", "domain")
        .unique()
    )
    _truncate(conn, "atlas.organic_top10")
    n = _copy_df(
        conn, exploded, "atlas.organic_top10", ["keyword_result_id", "domain"]
    )
    console.log(f"  atlas.organic_top10: {n:,} rows")
    return n


def compute_findings(conn: Connection) -> None:
    """Compute and persist F1–F6 directly in SQL on the loaded data."""
    with conn.cursor() as cur:
        # F1 — query length × AIO presence
        cur.execute("TRUNCATE atlas.f1_query_length_aio")
        cur.execute(
            """
            INSERT INTO atlas.f1_query_length_aio (bucket, sort_key, rows, aio_rows, aio_pct)
            SELECT
                CASE
                    WHEN keyword_token_count <= 2 THEN '1-2'
                    WHEN keyword_token_count <= 4 THEN '3-4'
                    WHEN keyword_token_count <= 6 THEN '5-6'
                    WHEN keyword_token_count <= 9 THEN '7-9'
                    ELSE '10+'
                END AS bucket,
                CASE
                    WHEN keyword_token_count <= 2 THEN 1
                    WHEN keyword_token_count <= 4 THEN 2
                    WHEN keyword_token_count <= 6 THEN 3
                    WHEN keyword_token_count <= 9 THEN 4
                    ELSE 5
                END AS sort_key,
                COUNT(*) AS rows,
                COUNT(*) FILTER (WHERE has_ai_overview) AS aio_rows,
                ROUND(100.0 * COUNT(*) FILTER (WHERE has_ai_overview) / COUNT(*), 2) AS aio_pct
            FROM atlas.keyword_results
            GROUP BY 1, 2
            """
        )

        # F2 — AIO ↔ top-10 overlap (aggregate metrics).
        # Compute n_cited and n_top10 in independent CTEs so they don't
        # collapse to the join overlap. Overlap is via INNER JOIN.
        cur.execute("TRUNCATE atlas.f2_top10_overlap")
        cur.execute(
            """
            WITH cited AS (
                SELECT keyword_result_id, COUNT(DISTINCT domain) AS n_cited
                FROM atlas.aio_citations
                GROUP BY keyword_result_id
            ),
            top10 AS (
                SELECT keyword_result_id, COUNT(DISTINCT domain) AS n_top10
                FROM atlas.organic_top10
                GROUP BY keyword_result_id
            ),
            overlap AS (
                SELECT a.keyword_result_id, COUNT(DISTINCT a.domain) AS n_overlap
                FROM atlas.aio_citations a
                INNER JOIN atlas.organic_top10 o
                        ON a.keyword_result_id = o.keyword_result_id
                       AND a.domain = o.domain
                GROUP BY a.keyword_result_id
            ),
            joined AS (
                SELECT c.keyword_result_id,
                       c.n_cited,
                       COALESCE(t.n_top10, 0)  AS n_top10,
                       COALESCE(ov.n_overlap, 0) AS n_overlap
                FROM cited c
                LEFT JOIN top10   t  USING (keyword_result_id)
                LEFT JOIN overlap ov USING (keyword_result_id)
            )
            INSERT INTO atlas.f2_top10_overlap (metric, value)
            SELECT 'rows_analyzed', COUNT(*) FROM joined
            UNION ALL
            SELECT 'avg_cited', AVG(n_cited) FROM joined
            UNION ALL
            SELECT 'avg_top10', AVG(n_top10) FROM joined
            UNION ALL
            SELECT 'avg_overlap', AVG(n_overlap) FROM joined
            UNION ALL
            SELECT 'pct_cited_in_top10',
                   AVG(CASE WHEN n_cited > 0 THEN n_overlap::float / n_cited ELSE 0 END)
            FROM joined
            """
        )

        # F3 — top cited domains + density
        cur.execute("TRUNCATE atlas.f3_top_cited_domains")
        cur.execute(
            """
            WITH agg AS (
                SELECT a.domain,
                       COUNT(*) AS citations,
                       COUNT(DISTINCT k.keyword) AS distinct_keywords
                FROM atlas.aio_citations a
                JOIN atlas.keyword_results k ON k.id = a.keyword_result_id
                GROUP BY a.domain
            )
            INSERT INTO atlas.f3_top_cited_domains
                  (domain, citations, distinct_keywords, citation_density, rank_overall)
            SELECT domain,
                   citations,
                   distinct_keywords,
                   ROUND((citations::numeric / NULLIF(distinct_keywords, 0)), 3) AS citation_density,
                   RANK() OVER (ORDER BY citations DESC) AS rank_overall
            FROM agg
            ORDER BY citations DESC
            LIMIT 200
            """
        )

        # F4 — AIO length weekly
        cur.execute("TRUNCATE atlas.f4_aio_length_weekly")
        cur.execute(
            """
            INSERT INTO atlas.f4_aio_length_weekly (week, rows, avg_chars, p50_chars, p90_chars)
            SELECT
                date_trunc('week', created_at)::date AS week,
                COUNT(*) AS rows,
                ROUND(AVG(aio_md_len))::int AS avg_chars,
                PERCENTILE_CONT(0.5)  WITHIN GROUP (ORDER BY aio_md_len)::int AS p50_chars,
                PERCENTILE_CONT(0.9)  WITHIN GROUP (ORDER BY aio_md_len)::int AS p90_chars
            FROM atlas.keyword_results
            WHERE has_ai_overview AND aio_md_len > 0
            GROUP BY 1
            ORDER BY 1
            """
        )

        # F5 — AIO rate by vertical
        cur.execute("TRUNCATE atlas.f5_aio_rate_by_vertical")
        cur.execute(
            """
            INSERT INTO atlas.f5_aio_rate_by_vertical (vertical, rows, aio_rows, aio_pct)
            SELECT
                vertical,
                COUNT(*) AS rows,
                COUNT(*) FILTER (WHERE has_ai_overview) AS aio_rows,
                ROUND(100.0 * COUNT(*) FILTER (WHERE has_ai_overview) / COUNT(*), 2) AS aio_pct
            FROM atlas.keyword_results
            GROUP BY 1
            ORDER BY 4 DESC
            """
        )

        # F6 — top cited domains per vertical (top 25 each)
        cur.execute("TRUNCATE atlas.f6_top_cited_by_vertical")
        cur.execute(
            """
            WITH per AS (
                SELECT k.vertical,
                       a.domain,
                       COUNT(*) AS citations
                FROM atlas.aio_citations a
                JOIN atlas.keyword_results k ON k.id = a.keyword_result_id
                GROUP BY k.vertical, a.domain
            ),
            ranked AS (
                SELECT vertical, domain, citations,
                       RANK() OVER (PARTITION BY vertical ORDER BY citations DESC) AS rank_in_vertical
                FROM per
            )
            INSERT INTO atlas.f6_top_cited_by_vertical (vertical, domain, citations, rank_in_vertical)
            SELECT vertical, domain, citations, rank_in_vertical
            FROM ranked
            WHERE rank_in_vertical <= 25
            """
        )

        # Run metadata
        cur.execute(
            """
            INSERT INTO atlas.load_runs (started_at, finished_at, source_rows, cleaned_rows, notes)
            VALUES (%s, now(),
                    (SELECT 244323),
                    (SELECT COUNT(*) FROM atlas.keyword_results),
                    'pull -> clean -> load run')
            """,
            (datetime.utcnow(),),
        )

    console.log("  findings tables populated (F1-F6)")


def run_load() -> None:
    console.log("[bold]Applying schema[/]")
    apply_schema()

    console.log("\n[bold]Loading source mirror tables[/]")
    with atlas_conn() as conn:
        load_projects(conn)
        load_keyword_results(conn)
        load_aio_citations(conn)
        load_organic_top10(conn)

    console.log("\n[bold]Computing findings tables[/]")
    with atlas_conn() as conn:
        compute_findings(conn)

    console.log("\n[green]Atlas Postgres is loaded.[/]")


if __name__ == "__main__":
    run_load()
