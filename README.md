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

These hold across the full dataset and will be developed in detail in the published report:

1. **Long-tail queries trigger AI Overviews 2.4× more than head terms.** 1–2 word queries: 32% AIO. 7+ word queries: 76% AIO.
2. **40% of AIO citations come from outside organic top 10.** Average AIO cites 9 domains; ~4 of them rank in the top 10. The rest sit at lower ranks or aren't ranked for that query at all.
3. **Banking and healthcare dominate AIO citations.** Top-cited domains are concentrated in financial services (Techcombank, VIB, VPBank, HDBank) and clinical/pharma sources (Long Châu Pharmacy, Vinmec, Medlatec, Tâm Anh).
4. **UGC platforms get cited at lower per-appearance rates than info-vertical domains.** Facebook and YouTube show up in many SERPs but get cited proportionally less often than health and banking domains. There appears to be a measurable AIO devaluation of UGC content.

## What this is not

- Not a tool. The Atlas is a study and a dashboard. The two follow-up projects in this workspace ([vn-aio-predictor](../vn-aio-predictor), [vn-aio-simulator](../vn-aio-simulator)) build on the Atlas's findings.
- Not a tracking SaaS. Profound, Peec, AthenaHQ, HubSpot AEO already exist. This is a research artifact, not a recurring monitoring product.
- Not anonymous data dump. Where data is published it will be aggregated to vertical or domain level — never raw client SERPs.

## Status

**Planning.** See [PLANNING.md](./PLANNING.md) for the methodology, anonymization plan, analytical questions, milestones, and publication strategy.

## About

A project led by Hoang Duc Viet (AI lead at [SEONGON](https://seongon.com)). The dataset is SEONGON's; the methodology, analysis, and publication are mine.

License: report and findings under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Code under MIT.
