# Changelog

All notable changes to the Vietnam AI Overview Atlas project. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [v0.3] — 2026-04-27

### Added

- **F11 — Per-vertical replication of F9.** The "sitelinks +213% headline" universal holds across every vertical but ranges from +116% (lifestyle) to +286% (banking). The rating signal flips sign by vertical: helps in jewelry/software/banking, hurts in healthcare/tourism. Surfaces the practical insight that one-size-fits-all SEO playbooks miss per-vertical signal flips.
- **F12 — Citation share-of-voice over time.** Monthly share-of-voice for top-5 domains in each vertical. Most verticals show stable hierarchies; banking saw a notable April-2026 compression in incumbent share that warrants investigation.
- **`atlas.f11_features_by_vertical`** and **`atlas.f12_share_of_voice_monthly`** persisted findings tables.
- **Heatmap component** for the dashboard — pure-CSS with diverging color scale (indigo for pro-cited signals, red for pro-uncited).
- **Sparkline component** for the dashboard — minimal SVG sparklines for compact in-row trend visualization in F12.
- **F11 and F12 sections** on the dashboard (server-rendered, vertical-filterable, EN/VI translated).
- **Per-vertical filter on F12** narrows the share-of-voice view to a single market.

### Fixed

- **Misdirected `railway up`** during the F11 deploy. The earlier `cd dashboard && cd ..` reset the Railway link to the personal-blog project. Caught at the next deploy via build URL inspection. Personal-blog wasn't damaged (Railway keeps the previous deploy live on build failure), but worth noting: always verify `railway status` before each `railway up`.

## [v0.2] — 2026-04-27

### Added

**Findings**

- F7 — Citation concentration per vertical. Reveals winner-take-all (jewelry top-10 = 49%) vs long-tail (construction top-10 = 13%) markets.
- F8 — AIO ↔ organic top-10 overlap by vertical. Healthcare 67%; tourism 47%. Confirms that ranking organically is not equally important across markets.
- F9 — Cited vs uncited URL features (Section 4 of the report). Sitelinks emerge as the largest single feature signal of AIO citation (+213% relative).
- F10 — AIO answer length and reference density by vertical. Healthcare AIOs are 67% longer than jewelry AIOs (5,520 vs 3,292 chars; 10.1 vs 7.1 references).

**Dashboard**

- Per-vertical filter (`?vertical=banking`). Re-scopes F1 (query length × AIO), F3 (top cited domains), F4 (length over time), and F6 (per-vertical hierarchy) to the selected vertical.
- Vietnamese translation toggle (`?lang=vi`). All UI strings, finding titles, takeaways, chart labels, and stat labels translate to idiomatic Vietnamese.
- "Read the full report" CTA in the hero, links to REPORT.md or REPORT_vi.md depending on language.
- OG meta tags + sitemap.xml + robots.txt for SEO and social sharing.
- F10 section showing two side-by-side charts (avg AIO length, avg reference count) sliced by vertical.

**Report**

- Section 5 — Implications by Vertical. ~3,500 words covering 12 verticals (banking, construction, FMCG, healthcare, logistics, retail, education, fintech, software, tourism, lifestyle, jewelry) plus a cross-vertical patterns subsection.
- Section 6 — Operational Implications for SEO Operators. Six subsections: 4 priority moves, 2 anti-priorities, per-vertical priority matrix, measurement framework, 90-day operator checklist, "what not to do" list.
- Vietnamese translation of Sections 5 and 6 (full).
- Tables of Contents added to both English and Vietnamese reports.
- Status bumped to draft v0.2.

**Infrastructure**

- New Postgres tables: `atlas.aio_references` (1.34M reference URLs), `atlas.organic_features` (179K per-organic-result feature rows with citation flags), `atlas.f7`–`atlas.f10` findings tables.
- New pull functions: `pull_aio_refs_urls`, `pull_organic_features` (sampled with incremental spill-to-disk).
- SQL fix for `has_price` column extraction (counted JSON-null as "has price" — fixed in `pull.py` for the next refresh; F9 currently excludes this field as a known data quality footnote).

### Changed

- `clean.py` vertical taxonomy expanded from ~12 mappings to 80+, with project-name fallback. "Unknown" residual dropped from 43% of cleaned rows to 3.6%.
- README rewritten with current artifact links (dashboard, report, findings doc) leading the document.
- Workspace umbrella README updated to reflect Atlas's progression from "planning" to "draft v0.2."

### Fixed

- F2 SQL: was double-counting `n_overlap` as `n_top10` due to a join scoping bug; rewritten with separate CTEs for `cited`, `top10`, `overlap`. Numbers now match the parquet computation.
- Dashboard: server-component → client-component prop passing fixed by replacing function-typed `valueFormatter` props with serializable `format: "pct" | "num" | "raw"` enums.

### Known issues

- `has_price` is excluded from F9 due to a known SQL extraction bug (counted JSON-null as "has price"). Fix is in `pull.py` for the next refresh; the existing parquet was pulled with the v1 SQL and re-pulling stalled on Postgres; the workaround is to exclude the column from F9 for now.
- `pull_organic_features` had two stalls during this session, both during the "fix" repull. The current parquet (179K rows from 10K sampled SERPs) was pulled successfully on the third attempt with chunk_size=100 and incremental disk spilling. Future refreshes should default to these settings.
- No automated data refresh cadence yet; the dataset is a December 2025 → April 2026 snapshot. A cron-based refresh is on the roadmap.

## [v0.1] — 2026-04-27

### Added

- Initial project structure: README, PLANNING, FINDINGS docs, MIT license, .gitignore.
- Python pipeline (`pull.py`, `clean.py`, `findings.py`, `load.py`) — pull from SEONGON Supabase, clean + anonymize, populate Atlas Postgres, generate charts.
- Atlas Postgres schema with source mirror tables (`atlas.projects`, `atlas.keyword_results`, `atlas.aio_citations`, `atlas.organic_top10`) and findings tables F1–F6.
- F1–F6 findings:
  - F1: AIO presence by query length
  - F2: AIO ↔ organic top-10 overlap
  - F3: Top cited AIO domains (with citation density)
  - F4: AIO length over time (null finding)
  - F5: AIO presence rate by vertical
  - F6: Top cited domains per vertical
- Dashboard MVP (Next.js 16 + Recharts) deployed to Railway.
- Report draft v0.1 with executive summary, methodology, sections 1–4 + 7. Sections 5–6 outlined.
- Vietnamese version of report (condensed).
