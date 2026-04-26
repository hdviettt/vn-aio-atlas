"""Clean + anonymize + vertical-tag the raw pulls.

Pipeline:
1. Load meta.parquet, projects.parquet, refs, organic top-10
2. Drop synthetic / malformed keywords
3. Anonymize: drop rows where keyword contains any client brand name/domain
4. Tag projects by vertical
5. Write cleaned parquet to data/clean/

Cleaning rules are conservative — when in doubt, drop. The goal is a
publishable corpus, not a maximized one.
"""

from __future__ import annotations

import re
import unicodedata
from pathlib import Path

import polars as pl
from rich.console import Console
from rich.table import Table

from atlas.config import CLEAN_DIR, RAW_DIR

console = Console()


# Vertical taxonomy. Substring match (case-insensitive, diacritics-stripped)
# against brand_domain + brand_name + project name. Order matters: first match
# wins, so put more-specific rules above more-generic ones.
VERTICAL_RULES: list[tuple[str, str]] = [
    # --- Banking ---------------------------------------------------------
    ("techcombank", "banking"),
    ("vpbank", "banking"),
    ("hdbank", "banking"),
    ("vib.com", "banking"),
    ("acb.com", "banking"),
    ("mbbank", "banking"),
    ("seabank", "banking"),
    ("vietinbank", "banking"),
    ("bidv", "banking"),
    ("msb", "banking"),
    ("mbv", "banking"),
    ("vcbs", "banking"),
    ("shbfinance", "banking"),
    ("shb finance", "banking"),
    ("prudential", "banking"),
    ("manulife", "banking"),
    # --- Fintech / payments ---------------------------------------------
    ("vnpay", "fintech"),
    ("timo.vn", "fintech"),
    ("viettelmoney", "fintech"),
    ("zalopay", "fintech"),
    ("cake.vn", "fintech"),
    # --- Healthcare / clinical / dental ---------------------------------
    ("vinmec", "healthcare"),
    ("medlatec", "healthcare"),
    ("tamanh", "healthcare"),
    ("hongngoc", "healthcare"),
    ("hong ngoc", "healthcare"),
    ("bv ", "healthcare"),  # benh vien (hospital) prefix
    ("benh vien", "healthcare"),
    ("benhvien", "healthcare"),
    ("vietlife", "healthcare"),
    ("elitedental", "healthcare"),
    ("elite dental", "healthcare"),
    ("dr care", "healthcare"),
    ("drcare", "healthcare"),
    ("maxcare", "healthcare"),
    ("novagen", "healthcare"),
    ("gentis", "healthcare"),
    ("bookingcare", "healthcare"),
    ("benhvienthucuc", "healthcare"),
    ("dnatestings", "healthcare"),
    ("youmed", "healthcare"),
    ("etest", "healthcare"),
    # --- Pharma ----------------------------------------------------------
    ("nhathuoclongchau", "pharma"),
    ("longchau", "pharma"),
    ("long chau", "pharma"),
    ("pharmacity", "pharma"),
    ("trimico", "pharma"),  # ginseng / supplements
    # --- Retail / e-commerce / electronics ------------------------------
    ("decathlon", "retail"),
    ("fptshop", "retail"),
    ("thegioididong", "retail"),
    ("dienmayxanh", "retail"),
    ("dienmaycholon", "retail"),
    ("bachhoaxanh", "retail"),
    ("avakids", "retail"),
    ("cellphones", "retail"),
    ("viettelstore", "retail"),
    ("viettel store", "retail"),
    ("maxxsport", "retail"),
    ("dmcl", "retail"),  # dien may cho lon
    ("sunhouse", "retail"),  # home appliances brand
    # --- FMCG / food / consumer goods -----------------------------------
    ("vinamilk", "fmcg"),
    ("sakuko", "fmcg"),
    ("rich", "fmcg"),
    ("redapron", "fmcg"),
    ("red apron", "fmcg"),
    ("qua viet", "fmcg"),
    ("quaviet", "fmcg"),
    ("tendoo", "fmcg"),
    # --- Construction / building / furniture / homewares ---------------
    ("weber", "construction"),
    ("duraflex", "construction"),
    ("cibeslift", "construction"),
    ("kalealifts", "construction"),
    ("osakar", "construction"),
    ("eurowindow", "construction"),
    ("vinh tuong", "construction"),
    ("vinhtuong", "construction"),
    ("knauf", "construction"),
    ("nhom viet dung", "construction"),  # nhôm Việt Dũng (aluminum)
    ("nhomvietdung", "construction"),
    ("nhom vd", "construction"),
    ("vietdung", "construction"),
    ("inox", "construction"),  # stainless steel
    ("tan a dai thanh", "construction"),
    ("tanadaithanh", "construction"),
    ("tadt", "construction"),
    ("the one", "construction"),  # furniture
    ("noithattheone", "construction"),
    ("noi that", "construction"),
    ("decor", "construction"),
    ("deco-crystal", "construction"),
    ("sendesign", "construction"),
    ("phung gia", "construction"),
    ("mutosi", "construction"),  # water purifiers
    ("queenpack", "construction"),
    ("queen pack", "construction"),
    ("cua so", "construction"),  # windows
    ("tmt", "construction"),
    # --- Logistics ------------------------------------------------------
    ("ghtk", "logistics"),
    ("ghn.vn", "logistics"),
    ("viettelpost", "logistics"),
    ("viettel post", "logistics"),
    ("knight log", "logistics"),
    ("knight.com", "logistics"),
    ("netco", "logistics"),
    # --- Education ------------------------------------------------------
    ("fpt.edu", "education"),
    ("fpteducation", "education"),
    ("fptu", "education"),
    ("vinuni", "education"),
    ("phenikaa", "education"),
    ("tata.edu", "education"),
    ("tata english", "education"),
    ("talkclass", "education"),
    ("talk class", "education"),
    # --- Tourism / travel -----------------------------------------------
    ("mundoasia", "tourism"),
    ("mundo", "tourism"),
    # --- Telecom / digital services -------------------------------------
    ("tv360", "telecom"),
    # --- Lifestyle / household services ---------------------------------
    ("dicungcon", "lifestyle"),
    ("jupviec", "lifestyle"),  # cleaning service
    # --- Software / B2B / professional services -------------------------
    ("bravo", "software"),  # accounting software
    ("ke toan", "software"),  # accounting
    ("ketoan", "software"),
    ("tmasolutions", "software"),
    ("tma solutions", "software"),
    ("canh cam", "software"),  # web/print agency
    ("canhcam", "software"),
    # --- Jewelry / gold / luxury ----------------------------------------
    ("baotinmanhhai", "jewelry"),
    ("bao tin manh hai", "jewelry"),
    ("btmh", "jewelry"),
    # --- Agriculture / agri-tech ----------------------------------------
    ("hop tri summit", "agritech"),
    ("hoptrisummit", "agritech"),
    ("hts", "agritech"),
]


SYNTHETIC_PATTERNS = [
    re.compile(r"^\s*[\.\"\']"),  # leading dots, quotes
    re.compile(r"[\t\r\n]"),  # tabs / newlines (real queries don't have these)
    re.compile(r"^\s*\d+\s*$"),  # bare numbers
    re.compile(r"^\s*$"),  # empty
    re.compile(r"https?://", re.IGNORECASE),  # URLs in keywords
    re.compile(
        r"\b(crm agent|course finder|assistant solution|for business|for enterprise)\b",
        re.IGNORECASE,
    ),
]


def _strip_diacritics(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def _vertical_for_domain(
    brand_domain: str | None,
    brand_name: str | None,
    project_name: str | None = None,
) -> str:
    """Map a project to a vertical using brand_domain + brand_name + project name.

    Many projects have empty brand_domain/brand_name but a descriptive
    project name (e.g. 'BV Hồng Ngọc', 'Elite Dental'), so we use it
    as a fallback haystack. Diacritics stripped for stable matching.
    """
    haystack_raw = " ".join(
        s for s in (brand_domain, brand_name, project_name) if s
    ).lower()
    if not haystack_raw:
        return "unknown"
    haystack = _strip_diacritics(haystack_raw)
    for needle, vertical in VERTICAL_RULES:
        if needle in haystack:
            return vertical
    return "unknown"


def _build_brand_blocklist(projects: pl.DataFrame) -> set[str]:
    """Collect normalized client brand names for keyword anonymization."""
    blocklist: set[str] = set()
    for row in projects.iter_rows(named=True):
        for field in ("brand_name", "brand_domain"):
            v = row.get(field)
            if not v:
                continue
            v = str(v).strip().lower()
            # Drop www. prefix, .vn / .com.vn / .com etc. domain suffixes
            v = re.sub(r"^https?://", "", v)
            v = re.sub(r"^www\.", "", v)
            v = re.sub(r"/.*$", "", v)
            v = v.split(".")[0]
            v = _strip_diacritics(v)
            if len(v) >= 4 and not v.isdigit():
                blocklist.add(v)
    # Generic / overly-broad terms we shouldn't filter on (would over-prune)
    for stop in {"shop", "store", "tcb", "mobile", "online", "viet", "vietnam", "tphcm"}:
        blocklist.discard(stop)
    return blocklist


def _is_synthetic(keyword: str) -> bool:
    if not keyword:
        return True
    if len(keyword.strip()) < 2:
        return True
    return any(p.search(keyword) for p in SYNTHETIC_PATTERNS)


def _contains_brand(keyword: str, blocklist: set[str]) -> bool:
    norm = _strip_diacritics(keyword.lower())
    for brand in blocklist:
        # word-boundary-ish: surrounded by non-alphanumerics or string edges
        if re.search(rf"(?:^|[^a-z0-9]){re.escape(brand)}(?:$|[^a-z0-9])", norm):
            return True
    return False


def _print_summary(label: str, before: int, after: int) -> None:
    dropped = before - after
    pct = 100.0 * dropped / before if before else 0.0
    console.log(f"  {label:<40} {before:>8,} -> {after:>8,}  (-{dropped:,}, {pct:.1f}%)")


def clean_meta(meta: pl.DataFrame, projects: pl.DataFrame) -> pl.DataFrame:
    """Apply cleaning rules to meta. Returns a filtered, vertical-tagged dataframe."""
    console.log("[bold]Cleaning meta[/]")
    n0 = len(meta)

    # Drop missing keywords
    meta = meta.filter(pl.col("keyword").is_not_null() & (pl.col("keyword").str.len_chars() > 0))
    n_after_missing = len(meta)
    _print_summary("missing/empty keyword", n0, n_after_missing)

    # Drop synthetic test queries
    meta = meta.with_columns(
        pl.col("keyword").map_elements(_is_synthetic, return_dtype=pl.Boolean).alias("__synth")
    )
    meta = meta.filter(~pl.col("__synth")).drop("__synth")
    n_after_synth = len(meta)
    _print_summary("synthetic / malformed", n_after_missing, n_after_synth)

    # Anonymize: drop rows whose keyword references a tracked client brand
    blocklist = _build_brand_blocklist(projects)
    console.log(f"  brand blocklist size: {len(blocklist)} terms")
    meta = meta.with_columns(
        pl.col("keyword")
        .map_elements(lambda k: _contains_brand(k, blocklist), return_dtype=pl.Boolean)
        .alias("__brand")
    )
    meta = meta.filter(~pl.col("__brand")).drop("__brand")
    n_after_brand = len(meta)
    _print_summary("client-brand-mentioning queries", n_after_synth, n_after_brand)

    # Vertical tag via project lookup. Includes project name as a fallback
    # for projects whose brand_domain/brand_name are empty.
    projects_simple = projects.select(
        pl.col("id").alias("project_id"),
        pl.struct("brand_domain", "brand_name", "name")
        .map_elements(
            lambda s: _vertical_for_domain(s["brand_domain"], s["brand_name"], s["name"]),
            return_dtype=pl.String,
        )
        .alias("vertical"),
    )
    meta = meta.join(projects_simple, on="project_id", how="left").with_columns(
        pl.col("vertical").fill_null("unknown")
    )

    console.log(
        f"  final cleaned meta: {len(meta):,} rows · "
        f"AIO present: {meta.filter(pl.col('has_ai_overview') == 1).height:,}"
    )
    return meta


def vertical_distribution(meta: pl.DataFrame) -> pl.DataFrame:
    return (
        meta.group_by("vertical")
        .agg(
            pl.len().alias("rows"),
            pl.col("has_ai_overview").sum().alias("aio_rows"),
        )
        .with_columns(((pl.col("aio_rows") / pl.col("rows")) * 100).round(1).alias("aio_pct"))
        .sort("rows", descending=True)
    )


def run_clean() -> None:
    meta = pl.read_parquet(RAW_DIR / "meta.parquet")
    projects = pl.read_parquet(RAW_DIR / "projects.parquet")

    cleaned = clean_meta(meta, projects)
    out = CLEAN_DIR / "meta.parquet"
    cleaned.write_parquet(out)
    console.log(f"[green]Wrote[/] {out} ({len(cleaned):,} rows)")

    # Vertical distribution summary
    vd = vertical_distribution(cleaned)
    table = Table(title="Vertical distribution after cleaning")
    table.add_column("vertical")
    table.add_column("rows", justify="right")
    table.add_column("aio rows", justify="right")
    table.add_column("aio %", justify="right")
    for row in vd.iter_rows(named=True):
        table.add_row(row["vertical"], f"{row['rows']:,}", f"{row['aio_rows']:,}", f"{row['aio_pct']}%")
    console.print(table)


if __name__ == "__main__":
    run_clean()
