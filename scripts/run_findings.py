"""Run the four headline findings on the cleaned corpus."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from atlas.findings import run_all  # noqa: E402

if __name__ == "__main__":
    run_all()
