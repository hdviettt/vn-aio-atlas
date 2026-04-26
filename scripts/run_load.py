"""Apply schema + load cleaned data into the Atlas Postgres + compute findings."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from atlas.load import run_load  # noqa: E402

if __name__ == "__main__":
    run_load()
