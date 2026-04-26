"""The four headline findings, on the cleaned full corpus.

Each `finding_*` returns a dataframe of results and writes a PNG chart.
A `run_all` orchestrates the four and prints a summary table.

Findings:
    1. AIO presence rate by query length (tokens)
    2. AIO vs organic top-10 citation overlap
    3. Top cited AIO domains overall and by vertical
    4. AIO markdown length distribution + week-over-week trend
"""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import polars as pl
from rich.console import Console
from rich.table import Table

from atlas.config import CHARTS_DIR, CLEAN_DIR, RAW_DIR

console = Console()
plt.rcParams.update(
    {
        "figure.figsize": (10, 6),
        "figure.dpi": 110,
        "savefig.dpi": 150,
        "savefig.bbox": "tight",
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.grid": True,
        "grid.alpha": 0.25,
        "font.family": "sans-serif",
    }
)
INDIGO = "#4f46e5"
INDIGO_LIGHT = "#a5b4fc"


def _load_meta() -> pl.DataFrame:
    return pl.read_parquet(CLEAN_DIR / "meta.parquet")


def finding_1_query_length(meta: pl.DataFrame) -> pl.DataFrame:
    """AIO presence rate as a function of query token count.

    Buckets: 1-2, 3-4, 5-6, 7-9, 10+.
    """
    df = meta.with_columns(
        pl.when(pl.col("keyword_token_count") <= 2)
        .then(pl.lit("1-2"))
        .when(pl.col("keyword_token_count") <= 4)
        .then(pl.lit("3-4"))
        .when(pl.col("keyword_token_count") <= 6)
        .then(pl.lit("5-6"))
        .when(pl.col("keyword_token_count") <= 9)
        .then(pl.lit("7-9"))
        .otherwise(pl.lit("10+"))
        .alias("bucket")
    )
    result = (
        df.group_by("bucket")
        .agg(
            pl.len().alias("rows"),
            pl.col("has_ai_overview").sum().alias("aio_rows"),
        )
        .with_columns(((pl.col("aio_rows") / pl.col("rows")) * 100).round(1).alias("aio_pct"))
        .sort("bucket")
    )
    # Order buckets sensibly
    order = ["1-2", "3-4", "5-6", "7-9", "10+"]
    result = pl.concat(
        [result.filter(pl.col("bucket") == b) for b in order if result.filter(pl.col("bucket") == b).height]
    )

    # Plot
    fig, ax = plt.subplots()
    bars = ax.bar(result["bucket"], result["aio_pct"], color=INDIGO, edgecolor="white", width=0.7)
    ax.set_xlabel("query token count (words)")
    ax.set_ylabel("AIO presence rate (%)")
    ax.set_title("AI Overview presence rate scales with query length", loc="left", weight="bold")
    ax.set_ylim(0, 100)
    for bar, pct, n in zip(bars, result["aio_pct"], result["rows"], strict=True):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height() + 1.5,
            f"{pct:.1f}%\nn={n:,}",
            ha="center",
            fontsize=9,
        )
    out = CHARTS_DIR / "f1_query_length_vs_aio.png"
    fig.savefig(out)
    plt.close(fig)
    console.log(f"  wrote {out}")
    return result


def finding_2_top10_overlap() -> dict[str, float]:
    """For AIO-positive rows: how many AIO citations also appear in organic top-10?

    Joins:
        aio_refs_domains.parquet (id -> cited_domains)
        organic_top10.parquet    (id -> top10_domains)
    Returns aggregate stats (averages across rows).
    """
    refs = pl.read_parquet(RAW_DIR / "aio_refs_domains.parquet")
    org = pl.read_parquet(RAW_DIR / "organic_top10.parquet")

    joined = refs.join(org.select("id", "top10_domains"), on="id", how="inner")

    # Polars-native list set operations (no map_elements needed).
    stats = joined.with_columns(
        pl.col("cited_domains").list.len().alias("n_cited"),
        pl.col("top10_domains").list.len().alias("n_top10"),
        pl.col("cited_domains")
        .list.set_intersection(pl.col("top10_domains"))
        .list.len()
        .alias("n_overlap"),
    ).with_columns(
        pl.when(pl.col("n_cited") > 0)
        .then(pl.col("n_overlap") / pl.col("n_cited"))
        .otherwise(0.0)
        .alias("pct_cited_in_top10")
    )

    summary = {
        "rows_analyzed": stats.height,
        "avg_cited": float(stats["n_cited"].mean()),
        "avg_top10": float(stats["n_top10"].mean()),
        "avg_overlap": float(stats["n_overlap"].mean()),
        "pct_cited_in_top10": float(stats["pct_cited_in_top10"].mean()),
    }

    # Distribution chart: histogram of pct_cited_in_top10 across rows
    fig, ax = plt.subplots()
    ax.hist(
        stats["pct_cited_in_top10"].to_numpy() * 100,
        bins=20,
        color=INDIGO,
        edgecolor="white",
    )
    ax.set_xlabel("% of AIO citations that also appear in organic top-10 (per query)")
    ax.set_ylabel("number of queries")
    ax.set_title(
        f"AIO citations vs organic top-10 overlap "
        f"(avg = {summary['pct_cited_in_top10'] * 100:.1f}%)",
        loc="left",
        weight="bold",
    )
    out = CHARTS_DIR / "f2_top10_overlap_distribution.png"
    fig.savefig(out)
    plt.close(fig)
    console.log(f"  wrote {out}")
    return summary


def finding_3_top_cited_domains(top_k: int = 25) -> pl.DataFrame:
    """Top AIO-cited domains overall, with a citation-density column.

    citation_density = citations / distinct_keywords
    Higher density = the domain gets cited multiple times for the same query
    (deep authority on its keywords). Lower density = spread thin (one
    citation per keyword across many keywords). Surfaces the
    UGC-vs-info-vertical citation pattern.
    """
    refs = pl.read_parquet(RAW_DIR / "aio_refs_domains.parquet")

    exploded = refs.explode("cited_domains").rename({"cited_domains": "domain"}).filter(
        pl.col("domain").is_not_null()
    )
    result = (
        exploded.group_by("domain")
        .agg(
            pl.len().alias("citations"),
            pl.col("keyword").n_unique().alias("distinct_kws"),
        )
        .with_columns(
            (pl.col("citations") / pl.col("distinct_kws")).round(2).alias("citation_density")
        )
        .sort("citations", descending=True)
        .head(top_k)
    )

    fig, ax = plt.subplots(figsize=(10, max(6, top_k * 0.3)))
    ax.barh(result["domain"][::-1], result["citations"][::-1], color=INDIGO, edgecolor="white")
    # Annotate each bar with its citation density
    for i, (cit, dens) in enumerate(zip(result["citations"][::-1], result["citation_density"][::-1], strict=True)):
        ax.text(
            cit + max(result["citations"]) * 0.005,
            i,
            f"density {dens:.2f}",
            va="center",
            fontsize=8,
            color="#475569",
        )
    ax.set_xlabel("AIO citations (count)")
    ax.set_title(
        f"Top {top_k} AIO-cited domains in Vietnamese commercial search\n"
        "(annotation: citations per distinct keyword — deep vs spread citation pattern)",
        loc="left",
        weight="bold",
        fontsize=11,
    )
    out = CHARTS_DIR / "f3_top_cited_domains.png"
    fig.savefig(out)
    plt.close(fig)
    console.log(f"  wrote {out}")
    return result


def finding_6_top_cited_by_vertical(top_k: int = 10) -> pl.DataFrame:
    """Top cited domains within each vertical.

    Joins AIO ref domains to cleaned meta (which has vertical tags) so each
    citation is attributed to the SEONGON-client vertical that triggered
    that SERP. Useful for: 'who owns AIO citations in banking vs healthcare?'
    """
    refs = pl.read_parquet(RAW_DIR / "aio_refs_domains.parquet")
    meta = _load_meta().select("id", "vertical")

    joined = refs.join(meta, on="id", how="inner")
    exploded = joined.explode("cited_domains").rename({"cited_domains": "domain"}).filter(
        pl.col("domain").is_not_null()
    )

    counts = (
        exploded.group_by("vertical", "domain")
        .agg(pl.len().alias("citations"))
        .sort(["vertical", "citations"], descending=[False, True])
    )

    # Keep top-K per vertical
    top_per_vertical = counts.with_columns(
        pl.col("citations").rank("ordinal", descending=True).over("vertical").alias("rank")
    ).filter(pl.col("rank") <= top_k)

    # Filter out tiny verticals (<1K rows total)
    big_verticals = (
        meta.group_by("vertical").agg(pl.len().alias("vrows")).filter(pl.col("vrows") >= 1000)
    )["vertical"].to_list()
    top_per_vertical = top_per_vertical.filter(pl.col("vertical").is_in(big_verticals))

    # One chart per vertical, gridded
    verticals_sorted = sorted(big_verticals)
    n = len(verticals_sorted)
    cols = 3
    rows = (n + cols - 1) // cols
    fig, axes = plt.subplots(rows, cols, figsize=(16, 3.2 * rows))
    axes = axes.flatten() if rows > 1 else [axes] if cols == 1 else axes

    for i, vertical in enumerate(verticals_sorted):
        ax = axes[i]
        sub = top_per_vertical.filter(pl.col("vertical") == vertical).sort("citations")
        if sub.is_empty():
            ax.set_visible(False)
            continue
        ax.barh(sub["domain"], sub["citations"], color=INDIGO, edgecolor="white")
        ax.set_title(vertical, fontsize=11, weight="bold", loc="left")
        ax.tick_params(labelsize=8)
        ax.set_xlabel("citations", fontsize=8)

    for j in range(len(verticals_sorted), len(axes)):
        axes[j].set_visible(False)

    fig.suptitle(
        f"Top {top_k} AIO-cited domains by SEONGON-client vertical",
        weight="bold",
        fontsize=14,
        y=1.0,
    )
    fig.tight_layout()
    out = CHARTS_DIR / "f6_top_cited_by_vertical.png"
    fig.savefig(out, bbox_inches="tight")
    plt.close(fig)
    console.log(f"  wrote {out}")
    return top_per_vertical


def finding_7_concentration_by_vertical(min_rows: int = 1000) -> pl.DataFrame:
    """Citation concentration per vertical.

    For each vertical, what share of total citations goes to the top-1,
    top-3, top-5, top-10 domains? Higher concentration = winner-take-all
    market. Lower concentration = long-tail diversity.

    Excludes the residual `unknown` bucket and any vertical with fewer
    than `min_rows` (default 1000) underlying SERPs.
    """
    refs = pl.read_parquet(RAW_DIR / "aio_refs_domains.parquet")
    meta = _load_meta()

    # Big verticals only
    big = (
        meta.group_by("vertical").agg(pl.len().alias("rows")).filter(pl.col("rows") >= min_rows)
    )["vertical"].to_list()
    big = [v for v in big if v != "unknown"]

    joined = refs.join(meta.select("id", "vertical"), on="id", how="inner").filter(
        pl.col("vertical").is_in(big)
    )
    exploded = (
        joined.explode("cited_domains")
        .rename({"cited_domains": "domain"})
        .filter(pl.col("domain").is_not_null())
    )

    # Per (vertical, domain) citation counts
    per = exploded.group_by("vertical", "domain").agg(pl.len().alias("citations"))

    # Compute concentration metrics per vertical
    out_rows: list[dict] = []
    for vertical in sorted(big):
        sub = per.filter(pl.col("vertical") == vertical).sort("citations", descending=True)
        total = int(sub["citations"].sum())
        if total == 0:
            continue
        top1 = int(sub["citations"][0]) if sub.height >= 1 else 0
        top3 = int(sub["citations"].head(3).sum())
        top5 = int(sub["citations"].head(5).sum())
        top10 = int(sub["citations"].head(10).sum())
        top1_domain = sub["domain"][0] if sub.height >= 1 else None
        out_rows.append(
            {
                "vertical": vertical,
                "total_citations": total,
                "distinct_domains": sub.height,
                "top1_domain": top1_domain,
                "top1_share": round(100 * top1 / total, 1),
                "top3_share": round(100 * top3 / total, 1),
                "top5_share": round(100 * top5 / total, 1),
                "top10_share": round(100 * top10 / total, 1),
            }
        )
    result = pl.DataFrame(out_rows).sort("top5_share", descending=True)

    # Chart: stacked horizontal bars showing top-1 / top-3 minus top-1 / etc.
    fig, ax = plt.subplots(figsize=(11, max(5, result.height * 0.5)))
    verticals = result["vertical"].to_list()[::-1]
    top1 = result["top1_share"].to_list()[::-1]
    top3 = result["top3_share"].to_list()[::-1]
    top5 = result["top5_share"].to_list()[::-1]
    top10 = result["top10_share"].to_list()[::-1]

    # Layered bars: rest -> top10 -> top5 -> top3 -> top1
    rest = [100 - t for t in top10]
    seg_top10_minus_top5 = [t - s for t, s in zip(top10, top5, strict=True)]
    seg_top5_minus_top3 = [s - t for s, t in zip(top5, top3, strict=True)]
    seg_top3_minus_top1 = [t - o for t, o in zip(top3, top1, strict=True)]

    palette = ["#1e1b4b", "#3730a3", INDIGO, "#a5b4fc", "#e0e7ff"]
    ax.barh(verticals, top1, color=palette[0], label="top 1 domain")
    ax.barh(verticals, seg_top3_minus_top1, left=top1, color=palette[1], label="top 2-3")
    ax.barh(
        verticals,
        seg_top5_minus_top3,
        left=top3,
        color=palette[2],
        label="top 4-5",
    )
    ax.barh(
        verticals,
        seg_top10_minus_top5,
        left=top5,
        color=palette[3],
        label="top 6-10",
    )
    ax.barh(verticals, rest, left=top10, color=palette[4], label="rest of long tail")
    ax.set_xlim(0, 100)
    ax.set_xlabel("share of AIO citations within the vertical (%)")
    ax.set_title(
        "Citation concentration by vertical\n"
        "(how much of all AIO citations go to the top N domains?)",
        loc="left",
        weight="bold",
        fontsize=11,
    )
    ax.legend(loc="lower right", frameon=False, ncol=2, fontsize=9)
    out = CHARTS_DIR / "f7_concentration_by_vertical.png"
    fig.savefig(out)
    plt.close(fig)
    console.log(f"  wrote {out}")
    return result


def finding_8_overlap_by_vertical(min_rows: int = 1000) -> pl.DataFrame:
    """Per-vertical version of F2 (AIO ↔ organic top-10 overlap).

    F2 was a global 59.4%. Slicing by vertical reveals which markets play
    'AIO = top-10' and which see AIO reach into the long tail. Verticals
    that score low here = markets where ranking organically is *not enough*
    to be cited.
    """
    refs = pl.read_parquet(RAW_DIR / "aio_refs_domains.parquet")
    org = pl.read_parquet(RAW_DIR / "organic_top10.parquet")
    meta = _load_meta()

    big = (
        meta.group_by("vertical").agg(pl.len().alias("rows")).filter(pl.col("rows") >= min_rows)
    )["vertical"].to_list()
    big = [v for v in big if v != "unknown"]

    # Annotate with vertical, restrict to big verticals, restrict to cleaned ids
    valid = meta.select("id", "vertical").filter(pl.col("vertical").is_in(big))
    refs_v = refs.join(valid, on="id", how="inner")
    org_v = org.join(valid, on="id", how="inner")

    joined = refs_v.join(org_v.select("id", "top10_domains"), on="id", how="inner")
    stats = joined.with_columns(
        pl.col("cited_domains").list.len().alias("n_cited"),
        pl.col("top10_domains").list.len().alias("n_top10"),
        pl.col("cited_domains")
        .list.set_intersection(pl.col("top10_domains"))
        .list.len()
        .alias("n_overlap"),
    ).with_columns(
        pl.when(pl.col("n_cited") > 0)
        .then(pl.col("n_overlap") / pl.col("n_cited"))
        .otherwise(0.0)
        .alias("pct_cited_in_top10")
    )

    result = (
        stats.group_by("vertical")
        .agg(
            pl.len().alias("rows_analyzed"),
            pl.col("n_cited").mean().alias("avg_cited"),
            pl.col("n_top10").mean().alias("avg_top10"),
            pl.col("n_overlap").mean().alias("avg_overlap"),
            pl.col("pct_cited_in_top10").mean().alias("pct_cited_in_top10"),
        )
        .sort("pct_cited_in_top10", descending=True)
        .with_columns(
            (pl.col("pct_cited_in_top10") * 100).round(1).alias("pct_cited_in_top10_display")
        )
    )

    fig, ax = plt.subplots(figsize=(10, max(5, result.height * 0.45)))
    verticals = result["vertical"].to_list()[::-1]
    pcts = result["pct_cited_in_top10_display"].to_list()[::-1]
    ns = result["rows_analyzed"].to_list()[::-1]
    ax.barh(verticals, pcts, color=INDIGO, edgecolor="white")
    for i, (p, n) in enumerate(zip(pcts, ns, strict=True)):
        ax.text(p + 1, i, f"{p:.1f}%  (n={n:,})", va="center", fontsize=9)
    ax.set_xlim(0, 100)
    ax.set_xlabel("% of AIO citations also in organic top-10 (per query, averaged)")
    ax.axvline(59.4, color="#475569", linestyle="--", linewidth=1)
    ax.text(60, len(verticals) - 0.5, "global avg 59.4%", fontsize=8, color="#475569")
    ax.set_title(
        "AIO citations vs organic top-10 — by vertical\n"
        "lower % = AIO reaches further outside top-10 in this vertical",
        loc="left",
        weight="bold",
        fontsize=11,
    )
    out = CHARTS_DIR / "f8_overlap_by_vertical.png"
    fig.savefig(out)
    plt.close(fig)
    console.log(f"  wrote {out}")
    return result


def finding_5_aio_rate_by_vertical(meta: pl.DataFrame) -> pl.DataFrame:
    """AIO appearance rate by vertical — reveals which verticals AIO dominates."""
    result = (
        meta.group_by("vertical")
        .agg(
            pl.len().alias("rows"),
            pl.col("has_ai_overview").sum().alias("aio_rows"),
        )
        .with_columns(((pl.col("aio_rows") / pl.col("rows")) * 100).round(1).alias("aio_pct"))
        .filter(pl.col("rows") >= 1000)  # exclude tiny verticals
        .sort("aio_pct", descending=True)
    )
    fig, ax = plt.subplots(figsize=(10, max(5, result.height * 0.45)))
    ax.barh(result["vertical"][::-1], result["aio_pct"][::-1], color=INDIGO, edgecolor="white")
    for i, (pct, n) in enumerate(zip(result["aio_pct"][::-1], result["rows"][::-1], strict=True)):
        ax.text(pct + 1, i, f"{pct:.1f}%  (n={n:,})", va="center", fontsize=9)
    ax.set_xlabel("AIO presence rate (%)")
    ax.set_xlim(0, 100)
    ax.set_title(
        "AI Overview presence rate by SEONGON-client vertical",
        loc="left",
        weight="bold",
    )
    out = CHARTS_DIR / "f5_aio_rate_by_vertical.png"
    fig.savefig(out)
    plt.close(fig)
    console.log(f"  wrote {out}")
    return result


def finding_4_aio_length_over_time(meta: pl.DataFrame) -> pl.DataFrame:
    """AIO markdown length: distribution + weekly trend."""
    aio = meta.filter(pl.col("has_ai_overview") == 1).filter(pl.col("aio_md_len") > 0)

    weekly = (
        aio.with_columns(pl.col("created_at").dt.truncate("1w").alias("week"))
        .group_by("week")
        .agg(
            pl.len().alias("rows"),
            pl.col("aio_md_len").mean().round(0).cast(pl.Int64).alias("avg_chars"),
            pl.col("aio_md_len").median().cast(pl.Int64).alias("p50_chars"),
            pl.col("aio_md_len").quantile(0.9).cast(pl.Int64).alias("p90_chars"),
        )
        .sort("week")
    )

    # Chart: weekly avg + p50 + p90
    fig, ax = plt.subplots()
    ax.plot(weekly["week"], weekly["p90_chars"], color=INDIGO_LIGHT, lw=1.5, label="p90")
    ax.plot(weekly["week"], weekly["avg_chars"], color=INDIGO, lw=2.5, label="avg")
    ax.plot(weekly["week"], weekly["p50_chars"], color="#1e1b4b", lw=1.5, label="p50")
    ax.set_xlabel("week")
    ax.set_ylabel("AIO markdown length (chars)")
    ax.set_title("AIO length over time", loc="left", weight="bold")
    ax.legend(loc="upper right", frameon=False)
    fig.autofmt_xdate()
    out = CHARTS_DIR / "f4_aio_length_over_time.png"
    fig.savefig(out)
    plt.close(fig)
    console.log(f"  wrote {out}")
    return weekly


def run_all() -> None:
    console.log("[bold cyan]Loading cleaned meta[/]")
    meta = _load_meta()
    console.log(f"  {len(meta):,} rows · AIO+ {meta.filter(pl.col('has_ai_overview') == 1).height:,}")

    console.log("\n[bold]Finding 1 — query length vs AIO[/]")
    f1 = finding_1_query_length(meta)
    t1 = Table(title="F1: AIO presence by query token count")
    t1.add_column("bucket")
    t1.add_column("rows", justify="right")
    t1.add_column("aio rows", justify="right")
    t1.add_column("aio %", justify="right")
    for r in f1.iter_rows(named=True):
        t1.add_row(r["bucket"], f"{r['rows']:,}", f"{r['aio_rows']:,}", f"{r['aio_pct']}%")
    console.print(t1)

    console.log("\n[bold]Finding 2 — AIO vs organic top-10 overlap[/]")
    f2 = finding_2_top10_overlap()
    console.print(
        f"  rows analyzed: {f2['rows_analyzed']:,}\n"
        f"  avg cited per query: {f2['avg_cited']:.2f}\n"
        f"  avg organic top-10 per query: {f2['avg_top10']:.2f}\n"
        f"  avg overlap: {f2['avg_overlap']:.2f}\n"
        f"  pct of AIO citations also in top-10: {f2['pct_cited_in_top10'] * 100:.1f}%"
    )

    console.log("\n[bold]Finding 3 — top cited domains + density[/]")
    f3 = finding_3_top_cited_domains(top_k=25)
    t3 = Table(title="F3: Top 25 cited AIO domains (density = citations / distinct keywords)")
    t3.add_column("domain")
    t3.add_column("citations", justify="right")
    t3.add_column("distinct kws", justify="right")
    t3.add_column("density", justify="right")
    for r in f3.iter_rows(named=True):
        t3.add_row(
            r["domain"],
            f"{r['citations']:,}",
            f"{r['distinct_kws']:,}",
            f"{r['citation_density']:.2f}",
        )
    console.print(t3)

    console.log("\n[bold]Finding 4 — AIO length over time[/]")
    f4 = finding_4_aio_length_over_time(meta)
    if not f4.is_empty():
        first_avg = f4["avg_chars"][0]
        last_avg = f4["avg_chars"][-1]
        delta = last_avg - first_avg
        pct = (delta / first_avg) * 100 if first_avg else 0.0
        console.print(
            f"  weeks: {f4.height}\n"
            f"  first-week avg: {first_avg:,} chars\n"
            f"  last-week avg: {last_avg:,} chars\n"
            f"  delta: {delta:+,} ({pct:+.1f}%)"
        )

    console.log("\n[bold]Finding 5 — AIO rate by vertical[/]")
    f5 = finding_5_aio_rate_by_vertical(meta)
    t5 = Table(title="F5: AIO presence rate by client vertical (>= 1K rows)")
    t5.add_column("vertical")
    t5.add_column("rows", justify="right")
    t5.add_column("aio rows", justify="right")
    t5.add_column("aio %", justify="right")
    for r in f5.iter_rows(named=True):
        t5.add_row(r["vertical"], f"{r['rows']:,}", f"{r['aio_rows']:,}", f"{r['aio_pct']}%")
    console.print(t5)

    console.log("\n[bold]Finding 8 — AIO ↔ top-10 overlap by vertical[/]")
    f8 = finding_8_overlap_by_vertical()
    t8 = Table(title="F8: AIO citations also in organic top-10, per vertical")
    t8.add_column("vertical")
    t8.add_column("rows", justify="right")
    t8.add_column("avg cited", justify="right")
    t8.add_column("avg top-10", justify="right")
    t8.add_column("% in top-10", justify="right")
    for r in f8.iter_rows(named=True):
        t8.add_row(
            r["vertical"],
            f"{r['rows_analyzed']:,}",
            f"{r['avg_cited']:.2f}",
            f"{r['avg_top10']:.2f}",
            f"{r['pct_cited_in_top10_display']}%",
        )
    console.print(t8)

    console.log("\n[bold]Finding 7 — citation concentration by vertical[/]")
    f7 = finding_7_concentration_by_vertical()
    t7 = Table(title="F7: Citation concentration (% of all citations within vertical)")
    t7.add_column("vertical")
    t7.add_column("top-1 domain")
    t7.add_column("top-1 %", justify="right")
    t7.add_column("top-3 %", justify="right")
    t7.add_column("top-5 %", justify="right")
    t7.add_column("top-10 %", justify="right")
    t7.add_column("# domains", justify="right")
    for r in f7.iter_rows(named=True):
        t7.add_row(
            r["vertical"],
            r["top1_domain"] or "",
            f"{r['top1_share']}%",
            f"{r['top3_share']}%",
            f"{r['top5_share']}%",
            f"{r['top10_share']}%",
            f"{r['distinct_domains']:,}",
        )
    console.print(t7)

    console.log("\n[bold]Finding 6 — top cited domains by vertical[/]")
    f6 = finding_6_top_cited_by_vertical(top_k=10)
    # Print just the top 5 per vertical to keep console output readable
    for vertical in sorted(f6["vertical"].unique().to_list()):
        sub = f6.filter(pl.col("vertical") == vertical).sort("citations", descending=True).head(5)
        if sub.is_empty():
            continue
        t6 = Table(title=f"F6: top 5 cited domains in {vertical}")
        t6.add_column("domain")
        t6.add_column("citations", justify="right")
        for r in sub.iter_rows(named=True):
            t6.add_row(r["domain"], f"{r['citations']:,}")
        console.print(t6)


if __name__ == "__main__":
    run_all()
