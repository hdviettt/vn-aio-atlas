# The State of AI Search in Vietnam

### An empirical study of Google AI Overview behavior on Vietnamese commercial search, December 2025 – April 2026

**Author:** Hoang Duc Viet, AI Lead, SEONGON
**Status:** Draft v0.1 (preliminary; subject to legal/anonymization clearance)
**Live dashboard:** [vn-aio-atlas-dashboard-production.up.railway.app](https://vn-aio-atlas-dashboard-production.up.railway.app)
**Code & data infrastructure:** [github.com/hdviettt/vn-aio-atlas](https://github.com/hdviettt/vn-aio-atlas)

---

## Executive Summary

Across **244,323 query observations** spanning **264 brand projects** in 12 commercial verticals, this study tracks how Google's AI Overview (AIO) feature is reshaping the Vietnamese commercial search landscape from December 2025 through April 2026.

Five findings stand out:

1. **AI Overviews now appear on 63% of Vietnamese commercial queries**, with rate scaling steeply by query length: 32.8% on 1–2 word queries, 80.8% on queries of 10+ words. Long-tail informational queries — historically a high-conversion target for SEO operators — are now the part of the funnel where AIO is most pervasive.

2. **40% of AIO citations come from outside the organic top 10**. Across 153K AIO-positive SERPs, an average AIO cites 7.4 distinct domains, but only 4.3 of them rank in the organic top 10. Ranking organically remains useful — but a substantial fraction of AIO citation comes from sources that aren't ranked at all for the triggering query.

3. **AIO citation patterns differ qualitatively across markets**. In healthcare (67%), banking (61%), and fintech (64%), AIO citations and organic top-10 are tightly correlated. In tourism (47%), education (51%), and software (52%), AIO reaches well outside the top-10 to find sources. The same SEO playbook does not work in both regimes.

4. **Sitelinks are the largest single feature signal of AIO citation**. URLs with sitelinks (Google's signal of recognized site authority) are cited **3.1× more often** than URLs without (13.2% vs 4.2%). Average rank for cited URLs is 8.5 vs 13.5 for uncited — a real but smaller effect. Title and description length differences are negligible (~3%), suggesting on-page meta optimization is not the lever for AIO citation in this market.

5. **Vertical-level concentration ranges from winner-take-all to long-tail**. In jewelry and healthcare, the top 10 cited domains capture 46–49% of all AIO citations within the vertical. In construction and software, the top 10 capture only 13–15%. Brand strategy has to be calibrated to the structural concentration of the target vertical.

---

## Why This Study Exists

By April 2026, Google's AI Overview has crossed the threshold where it is no longer an edge feature — it is the default response for the majority of informational queries in the Vietnamese commercial market. Yet most published guidance to Vietnamese brands and agencies on AIO remains anecdotal or borrowed from English-market benchmarks.

This study fills that gap. Drawing on SEONGON's internal SERP-scraping pipeline — which runs continuously across 264 active client projects spanning every major commercial vertical in Vietnam — it presents the first scaled, empirical view of how AIO actually behaves in this market.

The intent is not advocacy. AIO is neither bad for Vietnamese brands nor universally good. The intent is **measurement**: to establish a baseline that future studies can build on, and to surface findings that contradict — or confirm — the operational assumptions agencies and in-house SEO teams are currently making.

---

## Methodology

### Dataset

**Source:** SEONGON's internal SERP-tracking pipeline, backed by the DataForSEO API. The pipeline runs against the Vietnamese Google index (location code 2704, language code `vi`) on a recurring basis, primarily as part of paid client engagements.

**Volume after cleaning:** 231,365 keyword-result rows across 264 distinct brand projects, covering 80,264 unique Vietnamese commercial queries. Of these, 148,006 (64%) returned an AI Overview at the time of capture.

**Time range:** December 2, 2025 → April 24, 2026 (~5 months).

**Per-row content:** each row carries the full DataForSEO API response for a single (query, snapshot) — the organic SERP with all results' titles, URLs, descriptions, breadcrumbs, structural flags (sitelinks, FAQ, ratings, featured snippets); the rendered AI Overview as markdown text; and the AIO's full reference list with cited URLs, domains, snippets, and positions.

### Cleaning and anonymization

To produce the publishable dataset:

1. **Brand-mention removal.** Any query containing a SEONGON-client brand name was dropped. ~5.3% of rows (12,909 rows) were removed.
2. **Synthetic query removal.** LLM-generated test queries, malformed strings (leading dots, tabs, bare numerals), and URL-form queries were filtered out (~0.0% of rows).
3. **Vertical tagging.** Each project was mapped to one of 12 verticals (banking, fintech, healthcare, pharma, retail, FMCG, construction, logistics, education, lifestyle, software, tourism) plus a `unknown` residual covering ~3.6% of rows. The mapping uses brand-domain plus brand-name plus project-name substring matching, with manual review for ambiguous cases.
4. **Aggregation-only publication.** All numbers reported in this study are aggregated to either the vertical level or the domain level. No raw client SERPs, individual queries, or per-client metrics are published.

### Limitations of the dataset

The dataset was assembled for SEONGON's internal client work, not as a representative random sample of Vietnamese search. Three biases follow:

- **Vertical mix reflects SEONGON's client base.** Construction (21% of cleaned rows) and banking (20%) are over-represented relative to a random sample of VN search. Healthcare and FMCG are well represented; agriculture, government services, and entertainment are sparse.
- **Query mix reflects active SEO targets.** Queries chosen for tracking are operationally interesting — they are typically commercial-intent or branded-adjacent, not the entirety of what real users search for.
- **Snapshots are non-uniform in time.** Some projects are scanned weekly; others were scanned only once. Aggregate trends are weighted by snapshot count, not by query importance.

These biases do not invalidate the findings — they constrain them. Where a finding is sensitive to bias, this study calls it out explicitly.

### Reproducibility

Every number in this study is computable from a public Postgres schema (`atlas.*`) populated by an open pipeline:

```
SEONGON Supabase (source) → data/raw/*.parquet → data/clean/meta.parquet → atlas.* tables → findings
```

Code: [github.com/hdviettt/vn-aio-atlas](https://github.com/hdviettt/vn-aio-atlas). The pipeline scripts (`scripts/run_pull.py`, `scripts/run_clean.py`, `scripts/run_load.py`, `scripts/run_findings.py`) reproduce the analysis end-to-end on a refreshed dataset.

---

## Section 1 — How Pervasive Is AI Overview in Vietnamese Commercial Search?

### Headline: 63% of tracked queries return an AIO; rate scales sharply with query length.

The aggregate AIO rate across the cleaned 231K-row corpus is **63%**. But this aggregate hides a sharp monotonic relationship with query length.

| Query length (tokens) | Rows | AIO rate |
|---|---:|---:|
| 1–2 words | 5,353 | **32.8%** |
| 3–4 words | 50,955 | 46.0% |
| 5–6 words | 90,211 | 64.6% |
| 7–9 words | 74,818 | 75.4% |
| 10+ words | 10,028 | **80.8%** |

A query of 10+ words is **2.5× more likely** to trigger AIO than a 1–2 word query. Every additional bucket sees a meaningful step up.

This contradicts a pattern of advice that has circulated in some Vietnamese SEO circles since AIO launched — namely, that AIO is mostly a "head-term" feature and long-tail queries remain insulated. In the Vietnamese commercial market, **the long tail is where AIO is most aggressive**.

### Why this matters operationally

Long-tail keywords have historically been a high-conversion area for SEO operators — they're cheaper to rank for, they tend to be more commercial-intent, and they reveal user need with high specificity. The data here suggests that this segment of the funnel is now the most AIO-saturated, meaning:

- Pages targeting long-tail queries face higher displacement risk from AIO consumption.
- The "answer-grade" content that AIO synthesizes from is likely drawn most heavily from pages that today rank well on long-tail queries.
- Brands that optimize content for long-tail intent should expect AIO to mediate the user's journey — not bypass them, but reshape what the click-through path looks like.

### Reading the chart

![F1 — AIO presence by query length](../charts/f1_query_length_vs_aio.png)

---

## Section 2 — Where Does AIO Pull Sources From?

### Headline: Average AIO cites 7.4 distinct domains; ~40% of those citations come from outside the organic top 10.

Across 153,052 AIO-positive SERPs analyzed, the relationship between AIO citation and organic ranking is more nuanced than commonly described:

| Metric | Value |
|---|---:|
| Average distinct domains cited per AIO | 7.4 |
| Average distinct organic top-10 domains | 7.9 |
| Average overlap (cited ∩ top-10) | 4.3 |
| **% of cited domains also in organic top-10** | **59.4%** |

The remaining **40.6% of AIO citations** come from sources that either rank lower than position 10 in the organic SERP or are not organically ranked for the query at all.

This mirrors recent English-market findings (Surfer SEO, ALM Corp) and validates that the same pattern holds in Vietnamese commercial search.

### Implication

Two operational truths follow:

- **Organic ranking remains useful for AIO citation.** A pure "rank well, get cited" framing isn't wrong — it's just incomplete.
- **There is a separate game to play for AIO citation that is partly, but only partly, correlated with traditional ranking.** Domains that earn AIO citation without ranking organically tend to be specialist or high-authority sources (industry references, official sources, niche topical authorities). For a brand competing on AIO visibility, "achieve top-10 organic" is no longer the only success metric.

This pattern is *not* uniform across verticals — see Section 4.

---

## Section 3 — Citation Density: Banks Versus UGC Platforms

### Headline: Vietnamese banks own their queries deeply. UGC platforms get cited thinly.

A finding that surfaced unprompted from the data: when ranked by total AIO citations, the top cited domains in Vietnamese commercial search follow a pattern that splits cleanly when you compute **citation density** — citations divided by distinct keywords.

| Domain | Citations | Distinct keywords | Density |
|---|---:|---:|---:|
| techcombank.com | 25,991 | 5,513 | **4.71** |
| nhathuoclongchau.com.vn | 22,639 | 9,765 | 2.32 |
| www.vinmec.com | 15,634 | 7,166 | 2.18 |
| **www.facebook.com** | **14,719** | **7,878** | **1.87** |
| timo.vn | 14,255 | 3,950 | 3.61 |
| **www.youtube.com** | **13,070** | **7,924** | **1.65** |
| www.vpbank.com.vn | 12,862 | 3,094 | 4.16 |
| www.mbbank.com.vn | 8,797 | 2,003 | **4.39** |
| acb.com.vn | 8,579 | 2,103 | 4.08 |

**Two clusters emerge:**

- **Banking domains** (Techcombank, MB, VPBank, HDBank, ACB, SeABank) sit at densities of 3.4–4.7. They are cited several times within the same AI Overview answer when they appear at all — a signal that AIO treats them as deep, trustworthy sources for the queries they're surfaced on.
- **UGC platforms** (Facebook 1.87, YouTube 1.65) appear in many SERPs (high keyword count) but are rarely cited deeply within any single answer.

Per appearance, AIO appears to **devalue UGC content**. Facebook shows up in 7,878 distinct query SERPs but receives only 1.87 citations per query when cited. By contrast, Techcombank shows up in 5,513 queries and is cited 4.71 times each. This is a substantial gap.

### Why this matters

For Vietnamese brands considering "should we invest in YouTube/Facebook content for AIO visibility?", the data suggests: **probably no — at least not as the primary play.** AIO appears to prefer specialist, official, or branded sources over general UGC platforms even within markets where UGC is heavily ranked organically.

For specialist domains in regulated verticals (banking, healthcare, legal), the high citation density is structural rather than coincidental — Google likely has explicit signals (E-E-A-T, schema markup, accredited domain registrations) that these sources are trustworthy for the kinds of queries they appear on.

---

## Section 4 — What Makes a URL Get Cited? (Section in progress)

The most operationally relevant question for SEO operators: *given that a URL has surfaced on an AIO-positive SERP, what features predict whether it gets cited in the AIO answer?*

To answer this, a random sample of 10,000 AIO-positive SERPs was drawn (yielding 179,201 organic URLs — 45,878 of which were cited in the AIO and 133,323 of which were not). Each URL was tagged with the SERP-level features visible to Google: rank position, title, description, breadcrumb, sitelinks, FAQ rich result, rating rich result, featured-snippet flag, and several others.

**The feature comparison reveals two strong signals and a list of weak ones:**

| Feature | Cited | Uncited | Δ (relative) |
|---|---:|---:|---:|
| **rank_absolute** | 8.55 | 13.52 | **−36.8%** |
| **% has_sitelinks** | 13.15% | 4.20% | **+213.3%** |
| % has_rating | 10.66% | 9.71% | +9.8% |
| avg title length (chars) | 51.0 | 49.5 | +3.1% |
| avg description length (chars) | 157.3 | 153.7 | +2.4% |
| % has_highlighted | 94.6% | 94.0% | +0.7% |

**The two signals that matter:**

1. **Rank still helps, but doesn't have to be top-3.** Cited URLs rank at position 8.5 on average; uncited URLs at position 13.5. The marginal value of moving from rank 5 to rank 1 for AIO citation purposes is meaningfully smaller than for organic CTR. Anything in the top-10 has non-trivial citation odds.

2. **Sitelinks are the strongest single binary signal in the dataset.** URLs with sitelinks are cited **3.1× more often** than URLs without (13.2% vs 4.2%). Sitelinks aren't a feature you optimize directly — they're earned, by Google's recognition of a site's structural authority. But the implication is clear: AIO favors domains Google has already classified as authoritative.

**The signals that don't matter (or are too weakly represented to claim):**

- Title length differences are 3% (51 vs 49.5 chars). If your meta titles are reasonable, this is captured.
- Description length differences are 2.4% (157 vs 154 chars). Same.
- Featured snippets and FAQ rich results are nearly absent in this sample (0% in both groups), so we cannot claim anything about them on this dataset.
- Rating rich results show a 10% lift — directional but small enough to treat with skepticism without a larger sample.

### Operational implication

For operators trying to optimize for AIO citation, these are the moves with the largest expected effect:

1. **Rank well, but stop optimizing aggressively for top-3.** The marginal investment in moving from rank 5 to rank 1 is better spent on the next item.
2. **Build for sitelinks.** Sitelinks reflect Google's perception of your site as a coherent, navigable, authoritative source. The structural moves that earn sitelinks — clear site hierarchy, distinct category pages, internal linking that signals primary navigation, brand-anchored search behavior — also correlate with AIO citation. This is the highest-leverage move surfaced by the data.

---

## Section 5 — Implications by Vertical

*(To be written. The dashboard already shows per-vertical citation hierarchies (F6) and concentration patterns (F7); this section will translate those into operational guidance for each major vertical: banking, healthcare, retail, fintech, FMCG, construction, logistics, education, software, lifestyle, tourism, jewelry.)*

Preliminary outline of the per-vertical sections:

- **Banking & Fintech.** AIO ↔ top-10 overlap is high (61%). Citation concentration is moderately concentrated (top-10 owns 31–40%). The market is competitive but stable; the playbook is "rank well + earn sitelinks + structured-data your product/rate pages." Defensive play is realistic.
- **Healthcare & Pharma.** AIO ↔ top-10 overlap is highest (67%). Citation concentration is high (top-10 owns ~46%). Long Châu, Vinmec, and Medlatec dominate; new entrants face real friction. The AIO-citation play is ranking well + medical content credibility (provider attribution, structured medical schema, citation footnotes).
- **Construction & Building Materials.** AIO ↔ top-10 overlap is among the lowest (54%). Top-10 concentration is the lowest in the dataset (12.8%). The market is fragmented; AIO is pulling from a long tail. New entrants have a real shot if they target structurally-rich content even without dominant ranking.
- **Education.** AIO ↔ top-10 overlap is 51%. Universities (Hoa Sen, HUTECH, FPT University, UEL, VinUni) own AIO citations. A new entrant in the education vertical without recognized institutional status faces the steepest climb.
- **Tourism.** AIO ↔ top-10 overlap is the lowest (47%). The vertical pulls from blogs, official tourism sites, and global content. The play is content depth + structural authority (long-form itineraries, photo-rich destination pages, structured trip data).

---

## Section 6 — Operational Implications for SEO Operators

*(To be written. Drawing on Sections 1–4, this section will distill the data into a prioritized list of operator moves: what to do today, what to deprioritize, and what to monitor.)*

Preliminary outline:

1. **Stop optimizing for short-tail AIO escape**. The 1–2 word queries with 33% AIO rate are the lowest-AIO-pressure portion of the funnel. Long-tail queries (where 76–81% of queries trigger AIO) is where the displacement risk is highest, but also where the citation opportunity is largest.

2. **Earn sitelinks before you optimize meta tags**. Sitelinks correlate with AIO citation 3× more strongly than any individual page-level feature.

3. **Calibrate to your vertical's concentration profile**. Construction or software brands face a long-tail market — the path to AIO visibility is content breadth and topical authority, not chasing a few dominant terms. Healthcare or banking brands face a concentrated market — defending share against incumbents matters more than entry.

4. **Drop UGC content as a primary AIO play**. The Facebook/YouTube citation density (1.6–1.9) suggests AIO does not value UGC sources at the same rate as specialist domains. UGC continues to play a role in organic SERP and brand signal, but is structurally devalued in AIO citation.

---

## Section 7 — Limitations and Open Questions

This section is intentionally explicit.

### What this study cannot answer

- **Causation**, only correlation. The correlation between sitelinks and AIO citation does not prove that earning sitelinks causes citation rate to rise. There may be a third factor (overall site authority) that drives both.
- **Click-through rate impact**. The dataset captures whether AIO appeared and what it cited, not whether users clicked through to the cited URLs. AIO citation might be a leading indicator of traffic — or it might cannibalize traffic. Both happen; this study cannot distinguish them.
- **Conversion impact**. Same caveat extended.
- **Time-series of citation share**. The 5-month window is enough for descriptive trends, not for causal claims about how AIO behavior is evolving.

### Known limitations of the analysis

- **Vertical mix is biased toward SEONGON's client base.** Construction and banking are over-represented; agriculture, government, entertainment are sparse.
- **F4 (AIO length over time) is a null finding.** −2.8% drift in 5 months is below the noise floor.
- **F9 excludes `has_price`** due to a known SQL extraction bug (the source pull counts JSON-null prices as "has price"). Fix is in `pull.py` for the next data refresh.
- **Sample sizes vary.** F9 uses a 10,000-SERP random sample (179K URLs). F2 and F3 use the full 153K SERPs. Where sample sizes are small, this study calls it out.

### What the next version should answer

- **Per-vertical replication of F9.** Are the cited-vs-uncited feature differences uniform across verticals, or do (for instance) banking and construction reward different signals?
- **Time-series of citation share-of-voice.** Are the dominant AIO-cited domains in each vertical stable, or is the citation hierarchy shifting?
- **Click-through and conversion impact.** Joining this dataset to traffic analytics from cooperating clients would surface the actual revenue impact of AIO presence vs absence.
- **Comparison with the English market.** Where do Vietnamese AIO behaviors mirror English, and where do they diverge?

---

## About

**Hoang Duc Viet** is the AI lead at SEONGON, a Vietnamese SEO agency. The methodology, analysis, and writing of this study are his. The dataset is SEONGON's, used with permission for aggregated public publication.

**SEONGON** is a digital marketing agency in Hanoi specializing in SEO and content marketing for Vietnamese enterprise clients. The internal SERP-tracking pipeline that produced this dataset runs as part of paid client engagements.

For correspondence: hoangducviet@seongon.com or via [hoangducviet.work](https://hoangducviet.work).

---

## Acknowledgments

This study would not exist without:

- The SEONGON team that built and maintains the SERP-scraping infrastructure across 264 active client projects.
- DataForSEO, whose API powers the underlying data collection.
- Every Vietnamese brand whose query targets are reflected (anonymized) in the corpus.

---

*Status: Draft v0.1. Sections 5 and 6 are outlined but not fully written. Sections 4 and 7 are complete in their current form. The full study will be released after legal/anonymization review by SEONGON.*

*Last updated: April 2026.*
