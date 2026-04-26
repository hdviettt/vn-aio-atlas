# Atlas — Planning

## Goals

1. Produce a 30–40 page empirical report on AI Overview behavior in Vietnamese commercial search, publishable as both a SEONGON-branded PDF and a long-form web post.
2. Ship an interactive public dashboard at `aio-atlas.seongon.com` (or similar) where readers can explore citation patterns by vertical.
3. Establish SEONGON and the author as the canonical reference for "how does AI search work in Vietnam" — measured by inbound press, conference invitations, and citations from other VN SEO content.

## Non-goals

- Building a tool, dashboard product, or recurring tracker. This is a study, not software-as-a-service.
- Releasing raw client data. All publication is aggregated to vertical or anonymized domain level.
- Comparison with English-market benchmarks. This study describes the Vietnamese market on its own terms; cross-language comparisons can come later.

## Dataset

Source: SEONGON's internal SERP-scraping pipeline backed by DataForSEO. Two storage backends — Supabase (master, 244K rows) and a Railway Postgres mirror (subset). Full schema:

```
keyword_results (244,323 rows)
├── id, project_id, session_id, keyword, has_ai_overview
├── raw_api_result      — full DataForSEO SERP JSON
├── aio_markdown        — full AIO generated text
├── aio_references      — citation list with domain, url, title, text
└── created_at

projects (264 rows): brand_name, brand_domain, location, language, …
check_sessions (596 rows): time-series snapshots per project
```

Per-row content includes: full organic SERP (titles, URLs, domains, descriptions, breadcrumbs, sitelinks, FAQ, ratings), full AIO text (avg 4,700 chars, p90 7,900 chars), and full AIO reference list (avg 9 references per AIO).

## Methodology

### Anonymization

Before any analysis touches a publishable surface:

1. Drop rows where `keyword` references client brands by name (filter against project `brand_name` and `brand_domain` lists).
2. Drop rows where `keyword` matches synthetic test patterns ("crm agent for business", LLM-generated test queries).
3. Drop rows with malformed unicode (~5% of rows have null bytes in `aio_references`).
4. Aggregate to vertical or domain level for any published number. Never publish a single client's data even by inference.

Expected usable corpus after cleaning: ~210K–225K rows.

### Vertical taxonomy

Map each project to a vertical via brand_domain lookup + manual classification. Initial taxonomy:

- Banking / fintech
- Healthcare / pharma / clinical
- Retail / e-commerce
- Education
- FMCG / food
- Construction / building materials
- Logistics
- Real estate
- Beauty / personal care
- Other

Target: ~10–12 verticals, each with ≥ 5K observations for statistical robustness.

### Analytical questions

The report is structured around answering these, in order:

**Section 1 — How prevalent is AI Overview on Vietnamese commercial search?**
- AIO presence rate overall, by vertical, by query length, over time
- Which verticals are most AIO-saturated, and is this growing?

**Section 2 — Where does AI Overview pull its sources from?**
- Citation overlap between AIO references and organic top 10
- Distribution of cited-domain ranks (how far down does AIO reach?)
- Does the "outside top 10" effect vary by vertical?

**Section 3 — Who wins citations in each vertical?**
- Top cited domains per vertical
- Citation concentration (is it winner-take-all or distributed?)
- Brand vs. third-party content ratio

**Section 4 — What kind of content gets cited?**
- Comparison of cited URL features (title length, structured data presence, sitelinks, breadcrumbs) vs. uncited URLs in the same SERP
- Description-text length and structure analysis
- Cited-vs-uncited difference among same-domain pages

**Section 5 — How is AI Overview itself evolving over five months?**
- Trend in average AIO length (preliminary signal: getting more concise)
- Citation count trend
- Vertical-specific shifts

**Section 6 — What this means for VN brands.**
- Implications by vertical
- Practical guidance grounded in the data, not extrapolated from English-market analysis

### Charts and visualizations

Each section ships with 3–5 charts. Key visualizations:

- AIO presence heatmap (vertical × query-length-bucket)
- Citation rank histogram (where in the original SERP do cited URLs come from?)
- Top cited domains by vertical (horizontal bar chart, faceted)
- Citation concentration curve (cumulative share by top N domains, per vertical)
- AIO length distribution over time
- Brand share-of-voice example for one anonymized vertical

### Statistical rigor

For every reported number:
- Confidence interval where applicable
- Sample size disclosed
- Sensitivity analysis where the underlying data has known noise (e.g. the synthetic-query contamination ~5%)

## Tech stack

- Analysis: Python (pandas, polars, duckdb on parquet exports), Jupyter notebooks committed to `notebooks/`
- Visualization: Observable Plot (web) + matplotlib/altair (PDF export)
- Dashboard: Next.js + Observable embeds, deployed on Railway. Static aggregated parquet files served from CDN.
- Report: published as a long-form post + PDF via the dashboard site.

## Milestones

| Phase | Duration | Deliverables |
|---|---|---|
| **0. Legal clearance** | 1 wk | Written internal SEONGON policy on what aggregations can be published. Client-side acknowledgements where contractually required. **Hard gate.** |
| **1. Data pipeline** | 2 wks | Cleaned, deduplicated, vertical-tagged dataset in parquet. Anonymization filters validated. |
| **2. Analysis** | 3 wks | All Section 1–5 questions answered with charts and sensitivity analysis, in notebook form. |
| **3. Dashboard** | 2 wks | Public dashboard live with explore-by-vertical functionality. |
| **4. Report writeup** | 2 wks | 30–40 page report ready, both web and PDF. |
| **5. Distribution** | 1 wk | Press outreach, social, conference outreach. |

Total: **~10–11 weeks** end-to-end (gated on legal step 0).

## Risks

| Risk | Mitigation |
|---|---|
| Legal blocks publication of client-derived data | Aggregate-only publishing; client opt-out where contracts require; treat step 0 as a hard gate |
| Findings are uninteresting (no surprising signals) | The four headline findings already hold; risk is low. If section 4 (content features) yields nothing, drop it rather than pad |
| Synthetic query contamination skews results | Aggressive cleaning; report sample sizes pre/post cleaning |
| Time-series too short for trend claims | 5 months is enough for descriptive trends, not enough for causal claims. Report descriptively, not predictively |
| Competitors copy methodology | The dataset is the moat, not the methodology. Methodology is meant to be public |

## Distribution

- Long-form post on the SEONGON blog and hoangducviet.work
- PDF download gated by email (lead capture for SEONGON)
- Press outreach to Search Engine Land, Search Engine Journal, ICTNews, VnExpress, Brands Vietnam
- Conference submissions: SEO Mastery Summit Saigon, Vietnam Web Summit, regional MarTech events
- Social: Twitter/X thread, LinkedIn long-form, Vietnamese-language video summary

## Open questions

1. Anonymization specifics: does aggregating at vertical level provide sufficient client confidentiality, or does any per-domain citation reporting risk identification? Decide with legal in step 0.
2. Public-data refresh cadence: should the dashboard be a static publication or refresh quarterly? Default: static for v1; if traction warrants, build the recurring index later (separate project).
3. English translation: publish in Vietnamese-first or English-first? Recommend English-first for international press, then Vietnamese full translation.
