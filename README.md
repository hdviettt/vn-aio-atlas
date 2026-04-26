# Vietnam AI Overview Atlas

An empirical study of how Google's AI Overviews behave on Vietnamese commercial search, backed by 244,000 query-result observations and 1.4 million citation events from December 2025 through April 2026.

## What this is

A public report and interactive dashboard that answer the question: **how is Google's AI Overview reshaping Vietnamese commercial search, vertical by vertical, and what does that mean for the brands competing in those verticals?**

Most of what's been written about AI Overviews so far is anecdote, single-keyword case studies, or English-market analysis extrapolated to other languages. This is the first study at scale on the Vietnamese market, drawn from real ongoing SERP scraping run by SEONGON for client work across 264 commercial projects.

## Why it matters

Vietnamese search has crossed the threshold where AI Overviews are no longer an edge case. In the dataset, **63% of queries return an AI Overview**, and that share rises sharply with query length: short head terms get an AIO 32% of the time; queries of seven or more words get one **76%** of the time. Long-tail queries — the bread and butter of most Vietnamese SEO programs — are the ones AIO is reshaping fastest.

Most published advice to brands is still treating AIO as the enemy of organic traffic. The data tells a more complicated story: AI Overviews cite an average of 9 distinct domains per answer, **40% of which sit outside the organic top 10**. The implication is significant: there is a separate game to play for AIO citation that is partly, but only partly, correlated with traditional ranking.

## What's in the dataset

| Metric | Value |
|---|---|
| Total query-result observations | 244,323 |
| Distinct queries | 80,264 |
| Queries with AI Overview present | 154,428 (63%) |
| Distinct brand projects | 264 |
| Time range | 2025-12-02 to 2026-04-24 |
| Tracked sessions (longitudinal) | 459 |
| Total AIO citation events | ~1.4 million |
| Total AIO-generated text | ~720 million characters |

Brands represented include Vinamilk, Techcombank, VIB, VPBank, HDBank, ACB, MB, Prudential, Vinmec, Medlatec, Tâm Anh Hospital, Hồng Ngọc Hospital, GHTK, Viettel Post, Decathlon, FPT Shop, and dozens of mid-market players across banking, healthcare, retail, e-commerce, education, and FMCG.

All public publications will use anonymized aggregations only. No client-identifying queries or proprietary metrics will be released.

## Headline findings (preview)

Six findings have been validated on the cleaned 231K-row corpus. Full
breakdown with charts and methodology in **[FINDINGS.md](./FINDINGS.md)**.

1. **Long-tail queries trigger AI Overviews 2.5× more than head terms.** 1–2 word queries: 32.8% AIO. 10+ word queries: 80.8%.
2. **40% of AIO citations come from outside organic top 10.** Average AIO cites 7.4 domains; ~4 rank in the top 10. The rest sit at lower ranks or aren't ranked at all.
3. **Banks own their queries deeply, UGC platforms get cited thinly.** New finding. Techcombank shows citation density of 4.71 (cited multiple times per query); Facebook 1.87 and YouTube 1.65 (one citation per query, spread thin).
4. **AIO length is stable over the 5-month window.** Null result, worth reporting.
5. **AIO presence varies dramatically by vertical.** Education 83%, healthcare 81%, banking 77% — but retail only 34% and construction 48%. ~50pp spread between most- and least-AIO-saturated verticals.
6. **Each vertical has its own citation hierarchy.** Banking dominated by TCB/Timo/VPBank, healthcare by Long Châu/Vinmec/Medlatec, logistics by GHN/Viettel Post/GHTK, etc. Per-vertical winner maps for 13 verticals.

![AIO presence by query length](charts/f1_query_length_vs_aio.png)

## What this is not

- Not a tool. The Atlas is a study and a dashboard. The two follow-up projects in this workspace ([vn-aio-predictor](../vn-aio-predictor), [vn-aio-simulator](../vn-aio-simulator)) build on the Atlas's findings.
- Not a tracking SaaS. Profound, Peec, AthenaHQ, HubSpot AEO already exist. This is a research artifact, not a recurring monitoring product.
- Not anonymous data dump. Where data is published it will be aggregated to vertical or domain level — never raw client SERPs.

## Status

**Planning.** See [PLANNING.md](./PLANNING.md) for the methodology, anonymization plan, analytical questions, milestones, and publication strategy.

## About

A project led by Hoang Duc Viet (AI lead at [SEONGON](https://seongon.com)). The dataset is SEONGON's; the methodology, analysis, and publication are mine.

License: report and findings under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Code under MIT.
