"""End-to-end pull from Supabase into data/raw/."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from atlas.pull import pull_all  # noqa: E402

if __name__ == "__main__":
    pull_all()
