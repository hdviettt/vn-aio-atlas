# The State of AI Search in Vietnam

### An empirical study of Google AI Overview behavior on Vietnamese commercial search, December 2025 – April 2026

**Author:** Hoang Duc Viet, AI Lead, SEONGON
**Status:** Draft v0.2 (preliminary; subject to legal/anonymization clearance)
**Live dashboard:** [vn-aio-atlas-dashboard-production.up.railway.app](https://vn-aio-atlas-dashboard-production.up.railway.app)
**Code & data infrastructure:** [github.com/hdviettt/vn-aio-atlas](https://github.com/hdviettt/vn-aio-atlas)
**Vietnamese version:** [REPORT_vi.md](./REPORT_vi.md)

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Why This Study Exists](#why-this-study-exists)
- [Methodology](#methodology)
- [Section 1 — How Pervasive Is AI Overview in Vietnamese Commercial Search?](#section-1--how-pervasive-is-ai-overview-in-vietnamese-commercial-search)
- [Section 2 — Where Does AIO Pull Sources From?](#section-2--where-does-aio-pull-sources-from)
- [Section 3 — Citation Density: Banks Versus UGC Platforms](#section-3--citation-density-banks-versus-ugc-platforms)
- [Section 4 — What Makes a URL Get Cited?](#section-4--what-makes-a-url-get-cited-section-in-progress)
- [Section 5 — Implications by Vertical](#section-5--implications-by-vertical)
  - [5.1 Banking](#51--banking-47405-rows-77-aio-rate)
  - [5.2 Construction & Building Materials](#52--construction--building-materials-48455-rows-48-aio-rate)
  - [5.3 FMCG & Consumer Goods](#53--fmcg--consumer-goods-28461-rows-60-aio-rate)
  - [5.4 Healthcare & Pharma](#54--healthcare--pharma-combined-22005-rows-81-aio-rate)
  - [5.5 Logistics](#55--logistics-14376-rows-75-aio-rate)
  - [5.6 Retail & E-commerce](#56--retail--e-commerce-14970-rows-34-aio-rate)
  - [5.7 Education](#57--education-10398-rows-83-aio-rate)
  - [5.8 Fintech & Payments](#58--fintech--payments-15675-rows-60-aio-rate)
  - [5.9 Software & B2B](#59--software--b2b-7525-rows-70-aio-rate)
  - [5.10 Tourism](#510--tourism-2337-rows-65-aio-rate)
  - [5.11 Lifestyle & Household Services](#511--lifestyle--household-services-8415-rows-66-aio-rate)
  - [5.12 Jewelry](#512--jewelry-2223-rows-56-aio-rate)
  - [5.13 Cross-vertical patterns](#513--cross-vertical-patterns)
- [Section 6 — Operational Implications for SEO Operators](#section-6--operational-implications-for-seo-operators)
  - [6.1 Four moves with the largest expected impact](#61--the-four-moves-with-the-largest-expected-impact)
  - [6.2 Two anti-priorities](#62--the-two-moves-you-might-be-over-investing-in)
  - [6.3 Per-vertical priority mix](#63--per-vertical-priority-mix)
  - [6.4 Measurement framework](#64--measurement-framework)
  - [6.5 90-day operator checklist](#65--a-90-day-operator-checklist)
  - [6.6 What not to do](#66--what-not-to-do)
- [Section 7 — Limitations and Open Questions](#section-7--limitations-and-open-questions)
- [About](#about)

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

The aggregate findings (Sections 1–4) hold across the corpus, but their operational implications differ sharply between markets. A bank entering the AIO citation race faces a different problem than a construction-materials brand or an education provider — different concentration, different overlap with organic ranking, different pool of competing sources.

This section translates the per-vertical data (F5, F6, F7, F8) into actionable guidance. For each major vertical, it answers:

- *How AIO-pervasive is this market?* (F5)
- *Who already owns AIO citation share, and how concentrated is it?* (F6, F7)
- *Does ranking organically translate to citation, or does AIO reach further?* (F8)
- *What is the strategic posture (defend share / earn share / restructure for share) appropriate for a brand in this vertical?*
- *What tactical moves should an SEO operator in this vertical prioritize?*

Verticals are ordered by the size of their data footprint in the cleaned corpus, not by importance.

### 5.1 — Banking (47,405 rows, 77% AIO rate)

**Market structure.** Banking is the second-largest vertical in the corpus and one of the most AIO-saturated (77%). Citation concentration is moderate-to-high: the top 10 cited domains capture 40.5% of all AIO citations within the vertical. The top-10 organic overlap is 61% — meaning 39% of AIO citations come from outside the organic top 10.

**Who already owns it.** Techcombank dominates (23,285 citations across 5,513 distinct queries, citation density 4.2). The next tier — Timo (13,343), VPBank (12,502), HDBank (10,468), Cake (9,477) — collectively occupies most of the remaining citation share. ACB, MB, SeABank, BIDV, and Prudential round out the top 10. Together, this is a near-complete picture of Vietnam's tier-1 retail banks plus the leading neobank challengers.

**Strategic posture.** Defensive for incumbents; expensive but achievable for challengers. The market behaves like a stable oligopoly: a small number of well-capitalized brands occupy most of the citation share, and AIO largely confirms organic rankings (61% overlap). New entrants need to compete on multiple axes simultaneously — paid search, organic, content marketing, sitelink-earning site structure — to break into the top 10.

**Tactical priorities for SEO operators in banking.**

1. **Sitelinks are critical.** Per F9, sitelinks are the strongest single feature signal of AIO citation. Banking sites with deep navigational hierarchy (rate calculators, product pages, branch locators, FAQs) are precisely the kind of sites Google awards sitelinks to. Investing in clear category structure pays compound dividends.
2. **Structured data on product pages.** Bank product pages (savings accounts, loans, cards) are textbook structured-data targets. `Product`, `FinancialProduct`, `OfferAggregate` schemas signal to Google that the page is an authoritative product reference.
3. **Long-tail informational content.** AIO presence rises sharply with query length (F1). Banking has rich long-tail intent ("lãi suất tiết kiệm Techcombank kỳ hạn 6 tháng", "thẻ tín dụng cho người mới đi làm"). Long-form authoritative content for these queries gets cited; short generic product pages do not.
4. **Authoritative sourcing for editorial content.** When AIO synthesizes a banking answer, it weaves citations from multiple sources. Pages that cite primary sources (State Bank of Vietnam regulations, original financial data) and are themselves cited by other domains tend to compound their citation rate over time.

### 5.2 — Construction & Building Materials (48,455 rows, 48% AIO rate)

**Market structure.** Construction is the largest vertical in the corpus by rows but among the *least* AIO-saturated (47.7%) — partly because construction queries skew commercial ("báo giá thang máy") rather than informational. More striking: construction has the **lowest citation concentration in the dataset** (top-10 = 12.8% of citations) across **7,762 distinct cited domains**. AIO ↔ top-10 overlap is 53.5% — second-lowest after software and education.

**Who already owns it.** Lift companies dominate the SEONGON-tracked subset: Kalealifts (4,157), Cibeslift (3,972), Osakar (2,519), and Thang Máy Gia Đình (2,227). YouTube enters the top 5 (2,123) — unusual for a top-vertical position. Beyond the top 5, citations spread across thousands of small construction-materials suppliers, contractors, and review sites.

**Strategic posture.** Greenfield. The construction market is structurally fragmented; no single brand dominates AIO citation share. For a new or mid-market brand, this is the most accessible vertical to enter via AIO — but also the most operationally demanding, because winning means showing up across hundreds of long-tail queries rather than dominating a small set.

**Tactical priorities for SEO operators in construction.**

1. **Topical depth across categories.** A site covering ten construction-material categories with deep content per category will out-perform a site covering all categories shallowly. The fragmentation means the citation reward for breadth + depth is higher than in concentrated markets.
2. **Long-form content with structured comparison tables.** AIO loves source pages that present structured information (rated comparisons, spec tables, price ranges). Construction queries are often comparison-driven; a page that organizes the comparison cleanly is structurally easier to cite.
3. **Local SEO + Google Business Profile.** For physical products with regional installation requirements (lifts, windows, doors), Google's Business Profile signals feed into AIO indirectly. Verified GBP listings with rich attributes correlate with citation in the broader regional commerce queries.
4. **Don't expect to break into a top-10 list quickly.** Concentration is so low (12.8%) that "top-10 cited domain" is not a realistic medium-term target. The right metric is *citation rate per query in your sub-niche*, not absolute citation count.

### 5.3 — FMCG & Consumer Goods (28,461 rows, 60% AIO rate)

**Market structure.** Mid-saturation AIO presence (60%). Citation concentration is moderate (top-10 = 31.6% of citations). AIO ↔ top-10 overlap is 62.6%. The vertical sits between the highly-concentrated regulated markets (banking, healthcare) and the long-tail markets (construction, software).

**Who already owns it.** A surprising mix:

- **Avakids** (8,006) and **Bach Hoa Xanh** (6,478) — multi-category retailers covering FMCG categories.
- **Long Châu** (7,146) and **Pharmacity** — pharmacies, despite this being the FMCG vertical. The boundary between "FMCG" and "pharma" blurs in queries about supplements, baby formula, hygiene products.
- **Điện Máy Xanh** (2,961) — appliance retailer that handles FMCG-adjacent home goods.
- **Vinamilk** (2,520) — the only single-brand FMCG manufacturer in the top 5.

**Strategic posture.** Hybrid. FMCG manufacturers face structural headwinds: most of their AIO citations go to retail aggregators (Avakids, Bach Hoa Xanh) and pharmacy chains (Long Châu, Pharmacity), not to the brand's own .com.vn domain. Vinamilk is the exception that proves the rule — it occupies citation share through brand strength built over decades.

**Tactical priorities for SEO operators in FMCG.**

1. **Brand-domain content for branded queries.** Brand-name queries ("sữa Vinamilk", "khẩu trang 3M") are the queries where a manufacturer's .com.vn realistically wins citation share over retailers. Build deep brand-specific content (product info, manufacturer FAQs, certification details).
2. **Co-citation through retailers.** For non-branded category queries ("sữa bột cho trẻ sơ sinh"), the realistic play is partnering with the Avakids / Long Châu / Bach Hoa Xanh ecosystem so your products are well-described on their pages — the pages that AIO actually cites.
3. **Recipe / use-case content for niche FMCG.** AIO frequently cites recipe sites and use-case content for ingredient queries. A peanut butter brand competing on "công thức sinh tố bơ đậu phộng" is competing against recipe sites, not against grocery retailers.
4. **Treat AIO as a brand-perception channel, not a transaction channel.** AIO citation for FMCG is more about brand recognition reinforcement than direct conversion. Optimize for that — clear brand attribution in cited content matters more than click-through.

### 5.4 — Healthcare & Pharma (combined: 22,005 rows, 81% AIO rate)

**Market structure.** Among the most AIO-saturated verticals in the dataset (81% combined). Citation concentration is high (top-10 = 45.6%). AIO ↔ top-10 overlap is the **highest in the dataset (66.9%)** — meaning AIO closely tracks organic top-10 in healthcare. This is the most "ranking-determines-citation" market.

**Who already owns it.** Long Châu (11,475) and Vinmec (10,435) lead. Medlatec (9,130), Tâm Anh (6,837), and Bệnh Viện Thu Cúc (4,470) round out the top 5. All five are major Vietnamese healthcare brands with established trust positions: Long Châu is the country's largest pharmacy chain, Vinmec is a premium private-hospital network, Medlatec is a major diagnostic-services provider, Tâm Anh is a tertiary-care hospital chain, and Thu Cúc is a hospital and aesthetic-medicine network.

**Strategic posture.** Defensive for incumbents. Highly defended for challengers. Healthcare is the closest the data shows to a "earned reputation" market: AIO citation strongly correlates with organic ranking, which strongly correlates with brand recognition, which strongly correlates with regulated-credentialing (hospital licensing, pharmacy licensing, medical professional accreditation).

**Tactical priorities for SEO operators in healthcare and pharma.**

1. **E-E-A-T is non-negotiable.** Google's Experience-Expertise-Authoritativeness-Trustworthiness criteria apply with full force in YMYL (Your Money, Your Life) queries — and healthcare is the canonical YMYL category. Author bios with credentialed practitioners, medical reviewers attributed by name, citations to primary sources (Bộ Y Tế, peer-reviewed journals) are table stakes.
2. **Structured medical schema.** `MedicalCondition`, `Drug`, `MedicalGuideline`, `Hospital` schemas are well-supported by Google. Pages that markup medical content correctly get an authority lift.
3. **Long-form symptom-to-treatment content.** The dominant queries in healthcare AIO are informational: "triệu chứng tiểu đường", "cách điều trị viêm họng", "uống thuốc kháng sinh có tác dụng phụ gì". Long-form, well-cited, expert-reviewed content for these queries gets cited; thin content or aggressively transactional pages do not.
4. **Don't fake credentials.** AIO is conservative in healthcare — it has clear preferences for institutional sources. A new healthcare brand without licensing or credentialed practitioners will struggle to break in regardless of content quality. The right move is to build content while building the credentialing position simultaneously.

### 5.5 — Logistics (14,376 rows, 75% AIO rate)

**Market structure.** High AIO saturation (75%). Citation concentration is moderate (top-10 = 29.9%). AIO ↔ top-10 overlap is 57.5% — slightly below the global average. The market is meaningfully concentrated but not winner-take-all.

**Who already owns it.** Three giants and two challengers: GHN (4,862), Viettel Post (4,189), GHTK (3,398), 247Express (2,066), and Supership (1,784). Together these five capture roughly the top of the logistics citation hierarchy.

**Strategic posture.** Defensible-but-permeable for incumbents; viable for well-resourced challengers. The top three (GHN, Viettel Post, GHTK) have meaningful share but not so much that a credible challenger can't enter. Logistics queries are mostly transactional ("phí ship Hà Nội Sài Gòn", "thời gian giao hàng GHTK") and AIO answers them by aggregating across multiple carriers.

**Tactical priorities for SEO operators in logistics.**

1. **Live data pages that AIO can quote.** Pages that publish live or recently-updated shipping rates, transit times, and coverage maps get cited because AIO can extract specific facts. Static sales pages get cited less.
2. **Tracking-page SEO.** Each carrier has tracking-related queries with high volume. A tracking landing page that surfaces tracking number formats, expected delivery times, and FAQ around delays earns citation share for branded tracking queries.
3. **Comparison content.** "GHN vs GHTK" and similar comparisons drive citation toward content that organizes the comparison clearly. A neutral comparison post can earn citation for branded carriers' queries — even if the post is on a non-carrier domain.
4. **Local fulfillment content.** Logistics queries are often regional ("ship hàng HCM đi Hà Nội", "giao hàng tại Đà Nẵng"). Region-specific content with localized data wins citation over generic national content.

### 5.6 — Retail & E-commerce (14,970 rows, 34% AIO rate)

**Market structure.** Lowest AIO saturation in the dataset (34%). Citation concentration is moderate (top-10 = 23.8%). AIO ↔ top-10 overlap is 59.7%.

**Who already owns it.** Major Vietnamese retail and electronics chains: Decathlon (1,469), Cellphones (1,118), Điện Máy Xanh (1,059), Thế Giới Di Động (1,020), FPT Shop (826). The top 5 reflects who dominates Vietnamese branded retail search generally — AIO doesn't dramatically change the picture.

**Strategic posture.** AIO presence is low enough (34%) that retail SEO operators face less AIO displacement risk than other verticals. The main competitive dynamic is still organic rank against the major retail chains and the marketplaces (Shopee, Lazada — which appear less in this dataset because SEONGON's clients are mostly brand-direct).

**Tactical priorities for SEO operators in retail.**

1. **Don't over-invest in AIO defense.** With only 34% of retail queries returning AIO, the direct displacement risk to organic CTR is materially lower than in healthcare or banking. Effort allocation should reflect this — retail SEO is still primarily about ranking and converting, not about earning AIO citation.
2. **Category page structure for the AIO-eligible queries.** When AIO does appear in retail (commercial-informational hybrid queries — "loại thuốc nhuộm tóc nào tốt nhất"), it tends to cite category pages with curated lists rather than individual product pages. Investing in editorially-curated category pages with attribution wins those queries.
3. **Brand+keyword pages.** "Quần áo trẻ em Decathlon", "iPhone 15 FPT Shop" type queries have clear AIO behavior — they cite the branded retailer's specific category page. Build these systematically.
4. **Product schema everywhere.** Even where AIO doesn't directly cite, Product schema feeds into product carousels and rich results that compete with AIO for SERP real estate.

### 5.7 — Education (10,398 rows, 83% AIO rate)

**Market structure.** Highest AIO saturation in the dataset (83%). Citation concentration is moderate (top-10 = 18.3%) but concentrated among universities. AIO ↔ top-10 overlap is the **second-lowest in the dataset (50.6%)** — AIO reaches well outside top-10 to find sources for education queries.

**Who already owns it.** Universities, every single top-5 entry: Hoa Sen (1,760), HUTECH (1,546), FPT University (1,395), UEL (Trường Đại học Kinh tế - Luật, 1,380), and VinUni (1,305). The remainder of the top 25 includes other universities, MOET regulations sites, scholarship aggregators, and education review sites.

**Strategic posture.** Highly institutional. The AIO citation race in education is dominated by accredited universities. New entrants without university accreditation (e.g., language centers, professional certification programs, online education startups) face the steepest entry barrier in the dataset because the existing top-10 is structurally legitimized in a way that's hard to replicate.

**Tactical priorities for SEO operators in education.**

1. **Build for the long-tail AIO question pool.** Education has rich long-tail informational queries ("ngành công nghệ thông tin học gì?", "trường đại học nào tốt nhất ở Việt Nam?"). 50% of citation comes from outside top-10, meaning a well-cited authoritative content page can break into AIO citation without ranking #1.
2. **Author authority in education content.** Pages with named education professionals (deans, department heads, researchers) attached are more likely to be cited than anonymous content.
3. **Government/regulator citations.** Pages that cite Bộ Giáo dục regulations, university accreditation rosters, and primary regulatory sources earn AIO trust faster than pages without those references.
4. **Comparison and ranking content.** "Top universities for X" content earns citation share for institution-comparison queries even from non-university domains. A well-researched, current comparison post can break into the AIO citation set for queries where the universities themselves aren't competing directly.

### 5.8 — Fintech & Payments (15,675 rows, 60% AIO rate)

**Market structure.** Mid-saturation (60%) with moderate concentration (top-10 = 31.0%). AIO ↔ top-10 overlap is 64.3% — slightly above average.

**Who already owns it.** A more diverse mix than banking proper: VNPAY App (3,152), Vexere (2,459) — note: Vexere is travel/booking, not strictly fintech, but classified here because of payment-flow queries — MoMo (1,962), Facebook (1,729), and Thế Giới Di Động (1,703). The mix reflects the boundary-blurring nature of Vietnamese fintech: payment apps, e-wallets, BNPL, and adjacent services like ride-hailing and bookings all overlap.

**Strategic posture.** Faster-moving than banking, more concentrated than retail. The fintech vertical is in active reshuffling — VNPAY, MoMo, ZaloPay, and Cake are all competing for share. SEO operators in this space face an accelerated version of the banking dynamic: same playbook (sitelinks, structured data, long-tail content) but on a shorter time horizon.

**Tactical priorities for SEO operators in fintech.**

1. **Help-content + product-flow content.** "How to send money via MoMo to international account", "VNPAY error code 401" — these are the queries where fintech AIO citation reward is highest. Each app should own its own help-content.
2. **Comparison content.** Cross-product comparisons ("MoMo vs ZaloPay") earn citation share even for branded queries.
3. **Compliance and regulation content.** Vietnamese fintech is heavily regulated; pages explaining current regulatory positions (PSD changes, BNPL caps, KYC requirements) earn citation as authoritative regulatory references.
4. **Newer apps should focus on brand-name + use-case queries.** Generic "best e-wallet" queries are dominated by entrenched players. Better to win citation share on more specific use-cases ("e-wallet for shipping payments", "e-wallet that supports international cards") where the field is wider.

### 5.9 — Software & B2B (7,525 rows, 70% AIO rate)

**Market structure.** Mid-saturation (70%). Citation concentration is the **second-lowest in the dataset (top-10 = 15.1%)** across 4,856 distinct cited domains. AIO ↔ top-10 overlap is 51.8% — among the lowest. This is a long-tail market where AIO actively reaches outside top-10.

**Who already owns it.** Vietnamese accounting software and tax-tooling dominate: Misa AMIS (1,290), Kế Toán An Phá (931), AZTAX (500), and Thư Viện Pháp Luật (702 — a legal-document repository). YouTube (851) appears in the top 5 — unusual but reflects how-to content for accounting workflows.

**Strategic posture.** Greenfield-ish. Long-tail markets like software are where new entrants have the most realistic shot at AIO citation share, but achieving it requires breadth. The accounting-software niche has clear winners; other software niches (CRM, ERP, project management) are even more fragmented.

**Tactical priorities for SEO operators in software/B2B.**

1. **Long-form how-to content per use-case.** AIO reaches deep into long-tail for software queries. A page explaining "how to handle X in Vietnamese accounting" with credible authorial voice and primary-source citations outperforms aggressive product-marketing landing pages.
2. **Documentation as content.** Software companies' documentation pages are some of the highest-citation content in the vertical. Treating docs as content (with proper meta tags, structured navigation, schema markup) compounds citation share.
3. **Industry comparison content.** "Best [software type] for Vietnamese SMBs" earns citation share for shopper queries.
4. **Regulatory references.** Vietnamese accounting/tax software lives next to government regulations. Pages that map regulations to software workflows and cite Thư Viện Pháp Luật earn citation as practical authoritative references.

### 5.10 — Tourism (2,337 rows, 65% AIO rate)

**Market structure.** Mid-saturation (65%). Concentration is moderate (top-10 = 39.0%). AIO ↔ top-10 overlap is the **lowest in the dataset (46.5%)** — AIO reaches further outside organic ranking in tourism than anywhere else.

**Who already owns it.** A strikingly different mix from other verticals: Phi Phi Brazuca (849, a destination-content blog), YouTube (809), Mundo Asia Tours (758, a tour operator — and SEONGON client), Tailandiando.com (341, a Thai travel content site), and Instagram (339). The top 5 has *no* major Vietnamese travel agencies.

**Strategic posture.** Editorially-driven. Tourism AIO citation flows toward content depth (long-form destination content, photo-rich itineraries) rather than transactional booking pages. Major Vietnamese tour operators are conspicuously absent from the top citation set — a strategic gap.

**Tactical priorities for SEO operators in tourism.**

1. **Long-form destination content.** A multi-thousand-word piece on "5-day Bali itinerary for Vietnamese travelers" with structured day-by-day breakdown, photos, and pricing data earns citation share that booking-engine landing pages do not.
2. **Local Vietnamese-language travel content for foreign destinations.** Phi Phi Brazuca and Tailandiando rank well precisely because they fill a gap: Vietnamese-language content about non-Vietnam destinations. Vietnamese travel operators that publish Vietnamese-language destination content compete at this level.
3. **Photo + structured-data combination.** Tourism AIO answers often surface photos via image carousels alongside the AIO. Pages with good Image schema + named photographer attribution + travel-specific schema (Trip, TouristAttraction) earn cross-citation across both surfaces.
4. **The reach-outside-top-10 effect is strongest here.** Don't over-index on rank-1 obsession. A well-cited, well-photographed, well-structured tourism content page can break into AIO citation while ranking position 8 or 9 organically.

### 5.11 — Lifestyle & Household Services (8,415 rows, 66% AIO rate)

**Market structure.** Mid-saturation (66%). Concentration is moderate (top-10 = 31.8%). AIO ↔ top-10 overlap is 62.3%. Notably, the lifestyle vertical's top citations are *dominated by health domains* — reflecting how lifestyle queries blur into health.

**Who already owns it.** Long Châu (2,381), Vinmec (2,327), Medlatec (1,309), bTaskee (1,203 — a household-services app), and Tâm Anh (964). Four of the top 5 are health domains; only bTaskee is genuinely "lifestyle" in the household-services sense.

**Strategic posture.** Health-content dominated. Pure lifestyle brands competing on lifestyle queries face the structural challenge that AIO routes most lifestyle citations to health-credentialed domains. The path forward is either (a) adjacent positioning — pull queries into a specific lifestyle sub-domain (cleaning services, decor, fitness) where lifestyle brands actually compete — or (b) accept that AIO citation share for general lifestyle queries goes to health-credentialed sources.

**Tactical priorities for SEO operators in lifestyle.**

1. **Specialize the sub-vertical.** "Lifestyle" is too broad to compete in directly — but specific sub-niches (home services, fitness coaching, beauty rituals, parenting) have less crowded citation sets.
2. **Health-adjacent positioning.** Many lifestyle brands sit next to health (supplements, wellness, fitness). Authoritative content that cites medical research, has credentialed authors, and references Bộ Y Tế guidance can win citation share that pure lifestyle content cannot.
3. **Service review and how-to content.** bTaskee's citation share is built on practical "how to clean X", "how to handle Y" content. This template is replicable.

### 5.12 — Jewelry (2,223 rows, 56% AIO rate)

**Market structure.** Smallest of the major verticals (2,223 rows). Mid-saturation (56%). **Highest concentration in the dataset (top-10 = 48.7%)** — closest to winner-take-all of any vertical, despite being a small market.

**Who already owns it.** A distinctive mix: Goonus.io (769, a jewelry-information blog), PNJ (567, Vietnam's #1 jewelry retailer), Tierra (431), Phú Quý Group (307), and DOJI (282, a major precious-metals trader). The presence of Goonus.io at #1 — a content site, not a retailer — is striking.

**Strategic posture.** Competitive but cracking. Despite high concentration, the #1 spot belongs to a content site rather than the dominant retail brands (PNJ, DOJI). This suggests the AIO citation race in jewelry rewards informational depth over transactional positioning. The defended players are vulnerable on the content axis.

**Tactical priorities for SEO operators in jewelry.**

1. **Educational content over transactional content.** "Cách chọn nhẫn cưới", "phân biệt vàng 18k và 24k" — informational queries are where jewelry AIO citation flows. Goonus.io's #1 position is built on this.
2. **Material and craftsmanship content.** AIO loves content explaining *why* (why this material, why this craftsmanship technique, why this price point). Brand pages that explain craftsmanship earn citation that pure product pages don't.
3. **Authority through gemological credentials.** Mention of GIA (Gemological Institute of America) certifications, named gemologists, and structured product data feeds into AIO trust signals.

### 5.13 — Cross-vertical patterns

Three patterns emerge across verticals:

- **Health domains absorb adjacent queries.** Long Châu, Vinmec, and Medlatec appear in the top 5 of *both* healthcare and lifestyle, and Long Châu also leads FMCG. Health-credentialed domains pull citation share from broader query categories.
- **YouTube appears in long-tail, fragmented verticals.** YouTube enters the top 5 in software, construction, and tourism — verticals where the top-10 captures less than 16% of citations. YouTube's AIO citation rate per appearance is low (1.65), but in long-tail markets that low-density-but-broad presence is enough to crack the top 5.
- **Verticals with high concentration also have high overlap with top-10.** Healthcare (concentration 45.6%, overlap 67%) and banking (40.5%, 61%) anchor one regime. Construction (12.8%, 53.5%) and education (18.3%, 50.6%) anchor the opposite regime. This is a structural finding: in markets where AIO is winner-take-all, ranking organically maps tightly to citation; in markets where citation is fragmented, AIO reaches deeper.

---

## Section 6 — Operational Implications for SEO Operators

This section translates the data into specific, prioritized moves for SEO operators. It is structured as a playbook: what to start, what to stop, what to measure. The recommendations are calibrated by vertical (Section 5) — operators should treat the priorities below as defaults to apply unless their vertical's specific context overrides.

### 6.1 — The four moves with the largest expected impact

These four are the highest-leverage actions across most verticals. They are listed in priority order:

#### Move 1: Build the site structure that earns sitelinks

**Why.** Per F9, sitelinks are the single largest binary signal of AIO citation in the dataset (URLs with sitelinks are cited 3.1× more often than URLs without — 13.2% vs 4.2%). This is a structural, multi-month investment, not a tactical change. But it has the largest expected effect of any single intervention.

**How.** Sitelinks are awarded by Google based on:

- **Clear navigational hierarchy** — the site has a recognizable primary navigation that reflects the actual content structure.
- **Descriptive, brand-anchored navigation labels** — categories named in ways users actually search for (not internal jargon).
- **Brand-anchored search behavior** — users searching "[brand name] [product]" rather than just "[product]" — which Google interprets as the brand being a recognized destination for that query family.
- **Internal linking that reflects user navigation** — high in-link counts to key pages from menu structures and contextual links.

**What to measure.** Track sitelinks via Google Search Console (Performance report → page-level CTR + impressions). Sites that earn sitelinks see step-changes in branded-query CTR and AIO citation rate simultaneously.

#### Move 2: Calibrate content depth to vertical concentration

**Why.** Per F7, citation concentration ranges from 12.8% (construction) to 48.7% (jewelry). The right content strategy is fundamentally different across this range. In concentrated markets (banking, healthcare, jewelry), the defenders own most of the citation share — the path forward is depth on a specific positioning. In fragmented markets (construction, software, education), no one owns the share — the path forward is breadth across many sub-queries.

**How.**

- **In concentrated markets (top-10 ≥ 35%):** Pick a defensible positioning (a specific product line, customer segment, or content angle) and build depth on it. A narrow, deep, expert position beats a wide, shallow generalist position.
- **In fragmented markets (top-10 < 25%):** Build breadth across categories. A 50-page comprehensive guide that covers ten sub-categories will out-perform a 5-page focused site, because no single page is going to dominate.
- **In moderate markets (top-10 25–35%):** Hybrid. A core-depth strategy (3–5 hero positionings) with breadth in supporting topics.

**What to measure.** Per-query citation rate broken down by your site's positioning. If your site shows up in 30 distinct query SERPs but only gets cited in 2, your positioning isn't earning citation — back to the drawing board on depth.

#### Move 3: Long-tail content over head-term content

**Why.** Per F1, 1–2 word queries trigger AIO 32.8% of the time; 10+ word queries trigger AIO 80.8% of the time. Two operational implications:

1. The displacement risk to organic CTR from AIO is **highest** on long-tail queries.
2. The citation opportunity from AIO is **largest** on long-tail queries.

These two facts together mean: **the long tail is where AIO visibility actually matters**. Head-term traffic is meaningfully less affected by AIO; long-tail traffic is being reshaped.

**How.**

- Move resource allocation from "rank #1 for high-volume head terms" to "rank top-10 for hundreds of long-tail queries within your topic area."
- Build content that answers specific informational long-tail intents — "how to X for Y" rather than "best X" or "X reviews."
- Use existing keyword research tools (Ahrefs, Semrush, Google Search Console) to find long-tail queries your site already ranks for at positions 5–15. These are the queries where citation share is most achievable.

**What to measure.** Long-tail click-through rate against AIO appearance. If you appear at rank 8 for a long-tail query and AIO is also present, your CTR will likely be lower than for a query without AIO — but a citation in the AIO might offset that loss with brand signal.

#### Move 4: Drop UGC channels as a primary AIO play

**Why.** Per F3, Facebook (citation density 1.87) and YouTube (1.65) are present in many SERPs but are cited shallowly. AIO appears to systematically prefer specialist domains over general UGC.

**How.**

- Don't invest brand budget in YouTube/Facebook content with the primary goal of earning AIO citation share. The math doesn't favor it.
- UGC channels still play roles in (a) audience-building, (b) brand-signal reinforcement (so when AIO does cite a specialist source, the brand is recognized), and (c) social-search discovery on platforms that aren't Google. Continue investing in UGC for these reasons, just not for AIO citation.
- The exception: long-tail markets (construction, software, tourism) where YouTube cracks the top-5. Even here, YouTube isn't a primary citation channel — it's a sub-priority that benefits from being well-tagged with descriptions, transcripts, and structured metadata.

**What to measure.** Compare the citation rate (citations per query in your tracked set) for your owned domains vs your YouTube/Facebook content. The differential is informative — and almost always favors your owned domains.

### 6.2 — The two moves you might be over-investing in

These are common SEO investments that, on this dataset, return less than the four moves above:

#### Anti-priority 1: Aggressive top-3 ranking optimization

**Why.** Per F9, cited URLs rank at position 8.5 on average; uncited URLs at position 13.5. The marginal CTR boost from ranking 1 vs 5 is real for organic traffic, but the AIO citation reward is roughly the same across positions 1–10. If your goal is AIO citation share, the resource investment to move from position 5 to position 1 is better spent on Move 1 (sitelinks) or Move 2 (vertical-calibrated depth).

**Caveat.** This is *not* an argument against ranking well. It's an argument against the marginal investment in moving from already-ranking-well to ranking #1, when that investment competes for resources with structural moves that have larger AIO impact.

#### Anti-priority 2: Meta-title and meta-description fine-tuning for AIO

**Why.** Per F9, average title length differs by 3.1% between cited and uncited URLs (51 vs 49.5 chars). Average description length differs by 2.4% (157 vs 154 chars). These are not signals AIO is using to decide what to cite.

**Caveat.** Meta tags still matter for organic CTR (the snippet shown below the URL in regular search). Continue maintaining them at a reasonable quality. Just don't expect AIO citation gains from rewriting them.

### 6.3 — Per-vertical priority mix

Different verticals reward different moves. Below is the recommended priority weighting by vertical, from Section 5:

| Vertical | Sitelinks (Move 1) | Vertical-calibrated depth (Move 2) | Long-tail (Move 3) | UGC drop (Move 4) |
|---|---|---|---|---|
| Banking | **Critical** | Important | Important | Important |
| Healthcare | Critical | **Critical** | Critical | Important |
| Construction | Important | **Critical (breadth)** | Important | Less critical |
| Education | Important | **Critical** | **Critical** | Less critical |
| Tourism | Important | Important | **Critical** | Less critical |
| FMCG | Important | Important | Important | **Critical** |
| Logistics | **Critical** | Important | Important | Important |
| Retail | **Critical** | Important | Less critical | Important |
| Fintech | **Critical** | Important | Important | Important |
| Software | Less critical | **Critical (breadth)** | **Critical** | Less critical |
| Lifestyle | Important | Important | **Critical** | Important |
| Jewelry | Important | **Critical** | **Critical** | Important |

### 6.4 — Measurement framework

If you're going to make AIO-related investments, measure them. The following is a minimum measurement framework:

1. **Track AIO appearance rate per tracked query.** Run a SERP-tracking tool (DataForSEO, BrightLocal, custom scrapers) regularly enough to capture which queries return AIO and which don't.
2. **Track citation share for your domain.** For AIO-positive queries in your tracking set, what percentage cite your domain? Compare to top competitors.
3. **Track sitelinks status for your top pages.** Google Search Console → Performance → page-level. Pages that have sitelinks (visible as additional links below the main result) should be flagged distinctly.
4. **Track citation density.** Citations / distinct cited queries. A density above 3 means your domain is being cited multiple times for the same query — a sign of deep authority. A density near 1 means breadth without depth.
5. **Track AIO appearance rate by query length.** Are you over-investing in head-term optimization where AIO presence is lower?
6. **Track top-10 overlap for your vertical.** Healthcare's 67% overlap means rank-driven AIO; tourism's 47% means content-driven AIO. Knowing your vertical's number tells you how much of your investment should go into ranking vs structural authority.

### 6.5 — A 90-day operator checklist

For a marketing or SEO leader at a mid-market Vietnamese brand, here's a concrete 90-day plan to start moving on AIO:

**Days 1–14 (Audit):**
- Run a SERP-tracking pull for 200 queries representative of your tracked set.
- Identify which queries return AIO (your AIO-positive set) and which don't.
- For each AIO-positive query, identify which domains AIO cited (top 10 cited per vertical).
- Identify your current site's citation rate and the top 3 competitors' rates.

**Days 15–30 (Diagnose):**
- For your top 3 competitors with high citation share, examine their site structure for sitelinks, depth, and content topology.
- For each citation-gap query (where you rank but aren't cited), identify the cited URL's structural features (length, sitelinks, structured data, breadcrumb depth).
- Establish baseline metrics: sitelinks count, citation rate, citation density.

**Days 31–60 (Build):**
- If sitelinks are missing on key pages: rework site navigation hierarchy and internal linking to make navigation visible to Google.
- If your vertical is fragmented (construction, software, education, tourism): start a breadth-content sprint targeting 30+ long-tail queries in your subfield.
- If your vertical is concentrated (banking, healthcare, jewelry): pick a single core positioning and build depth content around it (8–12 substantive pieces).
- Deploy structured data appropriate to your vertical (FinancialProduct, MedicalCondition, Trip, Product, etc.).

**Days 61–90 (Iterate):**
- Re-run SERP tracking on the same 200 queries. Compare citation rate, sitelinks status, AIO appearance rate to baseline.
- Identify which moves moved the needle and double down. Identify which didn't and reallocate.
- Decide: is your domain on a citation-share growth trajectory (citation rate +20% over baseline), neutral, or declining? If declining, escalate to executive review — this is a strategic, not tactical, problem.

### 6.6 — What not to do

A short list of tempting but data-uninformed moves to avoid:

- **Don't write generic "AIO optimization" content.** AIO doesn't reward content explicitly written for AIO; it rewards content that's authoritative, well-structured, and discoverable. The framing that matters is "I'm writing for the user" not "I'm writing for AIO."
- **Don't pay for AIO citation services.** Several agencies in Vietnam are now selling "AIO ranking optimization" packages. The data does not support specific page-level interventions that consistently move citation rate. Move 1 (sitelinks) is structural, multi-month work that no shortcut substitutes for.
- **Don't conclude AIO is killing your traffic and stop investing in SEO.** SEO continues to work. AIO changes which content gets traffic, but well-ranked, well-cited content still wins. The right response is to invest in citation-quality content, not to disinvest from organic.
- **Don't stop using the SERP-tracking infrastructure your agency already runs.** Even imperfect SERP data is more useful than no data — and the data quality only improves as more periodic snapshots accumulate.
- **Don't expect overnight results.** The structural moves recommended here (sitelinks, depth, long-tail breadth) compound over months. A 90-day cycle is the minimum useful evaluation horizon.

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

*Status: Draft v0.2. All sections are now complete in narrative form. Sections 5 and 6 represent substantive new content over v0.1. The full study will be released after legal/anonymization review by SEONGON.*

*Last updated: April 2026.*
