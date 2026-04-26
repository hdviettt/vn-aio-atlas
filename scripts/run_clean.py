"""Cleaning + anonymization + vertical tagging of the raw pulls."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from atlas.clean import run_clean  # noqa: E402

if __name__ == "__main__":
    run_clean()
