"""List the projects that fell into 'unknown' so we can expand the taxonomy."""

from __future__ import annotations

import sys
from pathlib import Path

import polars as pl

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from atlas.clean import VERTICAL_RULES, _vertical_for_domain  # noqa: E402
from atlas.config import RAW_DIR  # noqa: E402

projects = pl.read_parquet(RAW_DIR / "projects.parquet")
meta = pl.read_parquet(RAW_DIR / "meta.parquet")

# Tag projects with vertical
projects = projects.with_columns(
    pl.struct("brand_domain", "brand_name", "name")
    .map_elements(
        lambda s: _vertical_for_domain(s["brand_domain"], s["brand_name"], s["name"]),
        return_dtype=pl.String,
    )
    .alias("vertical")
)

# Row counts per project
row_counts = meta.group_by("project_id").agg(pl.len().alias("rows")).rename({"project_id": "id"})

unknown_projects = (
    projects.filter(pl.col("vertical") == "unknown")
    .join(row_counts, on="id", how="left")
    .with_columns(pl.col("rows").fill_null(0))
    .sort("rows", descending=True)
)

print(f"\nTotal projects: {len(projects)}")
print(f"Unknown projects: {len(unknown_projects)}")
print(f"Total rows in unknown projects: {unknown_projects['rows'].sum():,}")
print(f"\nUnknown projects, ordered by row count:\n")

for row in unknown_projects.iter_rows(named=True):
    if row["rows"] == 0:
        continue
    print(
        f"  id={row['id']:>4}  rows={row['rows']:>6,}  "
        f"name='{row['name'] or ''}'  brand_name='{row['brand_name'] or ''}'  "
        f"brand_domain='{row['brand_domain'] or ''}'"
    )

print(f"\nVertical rules currently defined: {len(VERTICAL_RULES)}")
