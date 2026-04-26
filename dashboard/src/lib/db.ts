import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __atlasPool: Pool | undefined;
}

const pool =
  global.__atlasPool ??
  new Pool({
    connectionString: process.env.ATLAS_PG_URL,
    ssl: process.env.ATLAS_PG_URL?.includes("railway")
      ? { rejectUnauthorized: false }
      : undefined,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  global.__atlasPool = pool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const res = await pool.query(text, params);
  return res.rows as T[];
}

export type F1Row = {
  bucket: string;
  rows: number;
  aio_rows: number;
  aio_pct: number;
  sort_key: number;
};

export type F2Row = { metric: string; value: number };

export type F3Row = {
  domain: string;
  citations: number;
  distinct_keywords: number;
  citation_density: number;
  rank_overall: number;
};

export type F4Row = {
  week: string;
  rows: number;
  avg_chars: number;
  p50_chars: number;
  p90_chars: number;
};

export type F5Row = {
  vertical: string;
  rows: number;
  aio_rows: number;
  aio_pct: number;
};

export type F6Row = {
  vertical: string;
  domain: string;
  citations: number;
  rank_in_vertical: number;
};

export type F7Row = {
  vertical: string;
  total_citations: number;
  distinct_domains: number;
  top1_domain: string | null;
  top1_share: number;
  top3_share: number;
  top5_share: number;
  top10_share: number;
};

export type F8Row = {
  vertical: string;
  rows_analyzed: number;
  avg_cited: number;
  avg_top10: number;
  avg_overlap: number;
  pct_cited_in_top10: number;
};

export type F9Row = {
  feature: string;
  cited_value: number;
  uncited_value: number;
  relative_diff_pct: number | null;
  n_cited: number;
  n_uncited: number;
};

export async function getCorpusSummary() {
  const rows = await query<{
    total_rows: number;
    aio_rows: number;
    distinct_keywords: number;
    distinct_projects: number;
    distinct_verticals: number;
    earliest: string;
    latest: string;
    total_citations: number;
  }>(`
    SELECT
      (SELECT COUNT(*) FROM atlas.keyword_results)                            AS total_rows,
      (SELECT COUNT(*) FROM atlas.keyword_results WHERE has_ai_overview)      AS aio_rows,
      (SELECT COUNT(DISTINCT keyword) FROM atlas.keyword_results)             AS distinct_keywords,
      (SELECT COUNT(*) FROM atlas.projects)                                   AS distinct_projects,
      (SELECT COUNT(DISTINCT vertical) FROM atlas.keyword_results
        WHERE vertical <> 'unknown')                                          AS distinct_verticals,
      (SELECT MIN(created_at) FROM atlas.keyword_results)::text               AS earliest,
      (SELECT MAX(created_at) FROM atlas.keyword_results)::text               AS latest,
      (SELECT COUNT(*) FROM atlas.aio_citations)                              AS total_citations
  `);
  return rows[0];
}

export const f1 = () =>
  query<F1Row>(
    `SELECT bucket, rows, aio_rows, aio_pct, sort_key
       FROM atlas.f1_query_length_aio ORDER BY sort_key`,
  );

export const f2 = () => query<F2Row>(`SELECT metric, value FROM atlas.f2_top10_overlap`);

export const f3 = (limit = 25) =>
  query<F3Row>(
    `SELECT domain, citations, distinct_keywords, citation_density, rank_overall
       FROM atlas.f3_top_cited_domains
      ORDER BY rank_overall LIMIT $1`,
    [limit],
  );

export const f4 = () =>
  query<F4Row>(
    `SELECT week::text, rows, avg_chars, p50_chars, p90_chars
       FROM atlas.f4_aio_length_weekly ORDER BY week`,
  );

export const f5 = () =>
  query<F5Row>(
    `SELECT vertical, rows, aio_rows, aio_pct
       FROM atlas.f5_aio_rate_by_vertical
      ORDER BY aio_pct DESC`,
  );

export const f6 = (topK = 10) =>
  query<F6Row>(
    `SELECT vertical, domain, citations, rank_in_vertical
       FROM atlas.f6_top_cited_by_vertical
      WHERE rank_in_vertical <= $1
      ORDER BY vertical, rank_in_vertical`,
    [topK],
  );

export const f7 = () =>
  query<F7Row>(
    `SELECT vertical, total_citations, distinct_domains, top1_domain,
            top1_share, top3_share, top5_share, top10_share
       FROM atlas.f7_concentration_by_vertical
      ORDER BY top10_share DESC`,
  );

export const f8 = () =>
  query<F8Row>(
    `SELECT vertical, rows_analyzed, avg_cited, avg_top10, avg_overlap,
            pct_cited_in_top10
       FROM atlas.f8_overlap_by_vertical
      ORDER BY pct_cited_in_top10 DESC`,
  );

export const f9 = () =>
  query<F9Row>(
    `SELECT feature, cited_value, uncited_value, relative_diff_pct,
            n_cited, n_uncited
       FROM atlas.f9_cited_vs_uncited_features`,
  );
