-- Atlas analytical store. Holds the cleaned, vertical-tagged version
-- of SEONGON's source data, plus derived findings tables.
--
-- Design principles:
--   1. The "raw" tables here are already cleaned + anonymized — this
--      database never holds raw client data.
--   2. Findings tables are persisted (not views) so the dashboard
--      reads from indexed snapshots, not recomputed aggregations.
--   3. Source tables join on integer `id` (the original Supabase row id)
--      so we can re-pull and re-load deterministically.
--
-- Convention: `atlas_` prefix on every table for easy grants/revokes
-- when we expose this DB to a public dashboard.

DROP SCHEMA IF EXISTS atlas CASCADE;
CREATE SCHEMA atlas;
SET search_path TO atlas, public;

-- ─── Source mirror tables (cleaned + tagged) ─────────────────────────

CREATE TABLE atlas.projects (
    id              integer     PRIMARY KEY,
    name            text,
    brand_name      text,
    brand_domain    text,
    vertical        text        NOT NULL,
    location_code   text,
    language_code   text,
    created_at      timestamptz
);

CREATE TABLE atlas.keyword_results (
    id                    integer     PRIMARY KEY,
    project_id            integer     NOT NULL REFERENCES atlas.projects(id),
    session_id            integer,
    keyword               text        NOT NULL,
    has_ai_overview       boolean     NOT NULL,
    aio_md_len            integer     NOT NULL DEFAULT 0,
    keyword_token_count   integer,
    vertical              text        NOT NULL,
    created_at            timestamptz NOT NULL
);

CREATE INDEX idx_kr_vertical          ON atlas.keyword_results (vertical);
CREATE INDEX idx_kr_has_aio           ON atlas.keyword_results (has_ai_overview);
CREATE INDEX idx_kr_created           ON atlas.keyword_results (created_at);
CREATE INDEX idx_kr_project           ON atlas.keyword_results (project_id);
CREATE INDEX idx_kr_token_count       ON atlas.keyword_results (keyword_token_count);

-- One row per (AIO-positive keyword_result, cited domain). Exploded.
CREATE TABLE atlas.aio_citations (
    keyword_result_id  integer NOT NULL REFERENCES atlas.keyword_results(id),
    domain             text    NOT NULL,
    PRIMARY KEY (keyword_result_id, domain)
);
CREATE INDEX idx_cit_domain ON atlas.aio_citations (domain);

-- One row per (AIO-positive keyword_result, organic top-10 domain). Exploded.
CREATE TABLE atlas.organic_top10 (
    keyword_result_id  integer NOT NULL REFERENCES atlas.keyword_results(id),
    domain             text    NOT NULL,
    PRIMARY KEY (keyword_result_id, domain)
);
CREATE INDEX idx_top10_domain ON atlas.organic_top10 (domain);

-- AIO reference URLs (more granular than aio_citations — keeps URL + position)
CREATE TABLE atlas.aio_references (
    keyword_result_id  integer NOT NULL REFERENCES atlas.keyword_results(id),
    ref_position       text,
    ref_domain         text NOT NULL,
    ref_url            text NOT NULL
);
CREATE INDEX idx_refs_kr      ON atlas.aio_references (keyword_result_id);
CREATE INDEX idx_refs_domain  ON atlas.aio_references (ref_domain);

-- Per-organic-result feature row for AIO-positive SERPs.
-- One row per (keyword_result_id, organic_url). Used for cited-vs-uncited
-- feature comparisons in Section 4 of the report.
CREATE TABLE atlas.organic_features (
    keyword_result_id     integer NOT NULL REFERENCES atlas.keyword_results(id),
    rank_absolute         integer,
    domain                text,
    url                   text NOT NULL,
    title                 text,
    description           text,
    breadcrumb            text,
    title_length          integer,
    description_length    integer,
    is_featured_snippet   boolean,
    has_sitelinks         boolean,
    has_faq               boolean,
    has_rating            boolean,
    has_price             boolean,
    has_highlighted       boolean,
    -- Citation flags joined at load time
    domain_cited          boolean NOT NULL DEFAULT FALSE,
    url_cited             boolean NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_orgfeat_kr           ON atlas.organic_features (keyword_result_id);
CREATE INDEX idx_orgfeat_domain       ON atlas.organic_features (domain);
CREATE INDEX idx_orgfeat_domain_cited ON atlas.organic_features (domain_cited);
CREATE INDEX idx_orgfeat_url_cited    ON atlas.organic_features (url_cited);

-- ─── Derived findings (persisted, refreshed by load step) ─────────────

CREATE TABLE atlas.f1_query_length_aio (
    bucket     text PRIMARY KEY,
    rows       integer NOT NULL,
    aio_rows   integer NOT NULL,
    aio_pct    numeric(5,2) NOT NULL,
    sort_key   integer NOT NULL  -- for stable bucket ordering
);

CREATE TABLE atlas.f2_top10_overlap (
    metric  text PRIMARY KEY,  -- 'rows_analyzed' / 'avg_cited' / 'avg_top10' / etc.
    value   numeric(12,4) NOT NULL
);

CREATE TABLE atlas.f3_top_cited_domains (
    domain            text PRIMARY KEY,
    citations         integer NOT NULL,
    distinct_keywords integer NOT NULL,
    citation_density  numeric(8,3) NOT NULL,
    rank_overall      integer NOT NULL
);

CREATE TABLE atlas.f4_aio_length_weekly (
    week         date PRIMARY KEY,
    rows         integer NOT NULL,
    avg_chars    integer NOT NULL,
    p50_chars    integer NOT NULL,
    p90_chars    integer NOT NULL
);

CREATE TABLE atlas.f5_aio_rate_by_vertical (
    vertical  text PRIMARY KEY,
    rows      integer NOT NULL,
    aio_rows  integer NOT NULL,
    aio_pct   numeric(5,2) NOT NULL
);

CREATE TABLE atlas.f6_top_cited_by_vertical (
    vertical          text NOT NULL,
    domain            text NOT NULL,
    citations         integer NOT NULL,
    rank_in_vertical  integer NOT NULL,
    PRIMARY KEY (vertical, domain)
);
CREATE INDEX idx_f6_vertical ON atlas.f6_top_cited_by_vertical (vertical, rank_in_vertical);

-- F7 — Citation concentration per vertical
CREATE TABLE atlas.f7_concentration_by_vertical (
    vertical          text PRIMARY KEY,
    total_citations   integer NOT NULL,
    distinct_domains  integer NOT NULL,
    top1_domain       text,
    top1_share        numeric(5,2) NOT NULL,
    top3_share        numeric(5,2) NOT NULL,
    top5_share        numeric(5,2) NOT NULL,
    top10_share       numeric(5,2) NOT NULL
);

-- F8 — AIO vs organic top-10 overlap, per vertical
CREATE TABLE atlas.f8_overlap_by_vertical (
    vertical             text PRIMARY KEY,
    rows_analyzed        integer NOT NULL,
    avg_cited            numeric(10,4) NOT NULL,
    avg_top10            numeric(10,4) NOT NULL,
    avg_overlap          numeric(10,4) NOT NULL,
    pct_cited_in_top10   numeric(6,4) NOT NULL
);

-- F9 — Feature comparison: cited vs uncited URLs in AIO-positive SERPs
CREATE TABLE atlas.f9_cited_vs_uncited_features (
    feature              text NOT NULL,
    cited_value          numeric(12,4) NOT NULL,
    uncited_value        numeric(12,4) NOT NULL,
    relative_diff_pct    numeric(8,2),  -- (cited - uncited) / uncited * 100
    n_cited              integer NOT NULL,
    n_uncited            integer NOT NULL,
    PRIMARY KEY (feature)
);

-- ─── Run metadata ────────────────────────────────────────────────────

CREATE TABLE atlas.load_runs (
    id           serial PRIMARY KEY,
    started_at   timestamptz NOT NULL DEFAULT now(),
    finished_at  timestamptz,
    source_rows  integer,
    cleaned_rows integer,
    notes        text
);
