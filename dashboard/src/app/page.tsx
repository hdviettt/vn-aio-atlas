import {
  f1,
  f2,
  f3,
  f4,
  f5,
  f6,
  f7,
  f8,
  f9,
  getCorpusSummary,
  getVerticals,
} from "@/lib/db";
import { isLang, type Lang, tx } from "@/lib/i18n";
import { BarChartH } from "@/components/charts/BarChartH";
import { BarChartV } from "@/components/charts/BarChartV";
import { LineChart } from "@/components/charts/LineChart";
import { StickyHeader } from "@/components/StickyHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const fmtNum = (n: number) => Number(n).toLocaleString();

function Section({
  id,
  eyebrow,
  title,
  takeaway,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  takeaway?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-slate-200 py-12 first:border-t-0 first:pt-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2">
        {eyebrow}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-3">
        {title}
      </h2>
      {takeaway && (
        <p className="text-slate-600 leading-relaxed mb-8 max-w-3xl">{takeaway}</p>
      )}
      {children}
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
        {label}
      </div>
      <div className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

type SP = { vertical?: string | string[]; lang?: string | string[] };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const verticalRaw = Array.isArray(sp.vertical) ? sp.vertical[0] : sp.vertical;
  const langRaw = Array.isArray(sp.lang) ? sp.lang[0] : sp.lang;
  const lang: Lang = isLang(langRaw) ? langRaw : "en";

  const [verticals] = await Promise.all([getVerticals()]);
  const vertical = verticalRaw && verticals.includes(verticalRaw) ? verticalRaw : undefined;

  const [
    summary,
    f1Data,
    f2Data,
    f3Data,
    f4Data,
    f5Data,
    f6Data,
    f7Data,
    f8Data,
    f9Data,
  ] = await Promise.all([
    getCorpusSummary(),
    f1(vertical),
    f2(),
    f3(vertical),
    f4(vertical),
    f5(),
    f6(),
    f7(),
    f8(),
    f9(),
  ]);

  const f2Map = new Map(f2Data.map((r) => [r.metric, Number(r.value)]));

  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      <div className="mx-auto max-w-5xl px-6 pt-4 pb-16">
        <StickyHeader
          verticals={verticals}
          vertical={vertical}
          lang={lang}
          labels={{ all: tx(lang, "filter_all"), viewing: tx(lang, "filter_viewing") }}
        />

        {/* Hero */}
        <header className="mb-16">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600 mb-3">
            {tx(lang, "header_eyebrow")}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-5">
            {tx(lang, "header_title")}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            {tx(lang, "header_lede")}{" "}
            <strong className="text-slate-900">
              {fmtNum(summary.total_rows)}
            </strong>{" "}
            {tx(lang, "header_lede_q")}{" "}
            <strong className="text-slate-900">
              {fmtNum(summary.total_citations)}
            </strong>{" "}
            {tx(lang, "header_lede_c")}
          </p>

          {vertical && (
            <div className="mt-6 inline-flex items-center gap-2 text-sm bg-indigo-50 border border-indigo-200 px-3 py-2">
              <span className="text-indigo-900">
                {tx(lang, "vertical_banner_prefix")}{" "}
                <strong>{vertical}</strong>
              </span>
              <a
                href={lang === "en" ? "/" : "/?lang=vi"}
                className="text-indigo-600 hover:underline ml-2"
              >
                {tx(lang, "vertical_banner_clear")}
              </a>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 mt-12">
            <Stat label={tx(lang, "stat_rows")} value={fmtNum(summary.total_rows)} />
            <Stat
              label={tx(lang, "stat_aio_positive")}
              value={fmtNum(summary.aio_rows)}
              sub={`${((summary.aio_rows / summary.total_rows) * 100).toFixed(0)}% ${tx(lang, "stat_aio_subtotal")}`}
            />
            <Stat
              label={tx(lang, "stat_distinct_queries")}
              value={fmtNum(summary.distinct_keywords)}
            />
            <Stat label={tx(lang, "stat_brand_projects")} value={fmtNum(summary.distinct_projects)} />
            <Stat label={tx(lang, "stat_verticals")} value={String(summary.distinct_verticals)} />
            <Stat
              label={tx(lang, "stat_citations")}
              value={fmtNum(summary.total_citations)}
              sub={tx(lang, "stat_citations_sub")}
            />
            <Stat label={tx(lang, "stat_from")} value={summary.earliest?.slice(0, 10) ?? "—"} />
            <Stat label={tx(lang, "stat_to")} value={summary.latest?.slice(0, 10) ?? "—"} />
          </div>
        </header>

        {/* F1 */}
        <Section
          id="f1"
          eyebrow={tx(lang, "f1_eyebrow")}
          title={tx(lang, "f1_title")}
          takeaway={tx(lang, "f1_takeaway")}
        >
          <BarChartV
            data={f1Data.map((r) => ({
              label: r.bucket,
              value: Number(r.aio_pct),
            }))}
            yLabel={tx(lang, "f1_y_label")}
            format="pct"
          />
        </Section>

        {/* F2 */}
        <Section
          id="f2"
          eyebrow={tx(lang, "f2_eyebrow")}
          title={tx(lang, "f2_title")}
          takeaway={tx(lang, "f2_takeaway")}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat
              label={tx(lang, "f2_rows_analyzed")}
              value={fmtNum(f2Map.get("rows_analyzed") ?? 0)}
            />
            <Stat
              label={tx(lang, "f2_avg_cited")}
              value={(f2Map.get("avg_cited") ?? 0).toFixed(2)}
            />
            <Stat
              label={tx(lang, "f2_avg_overlap")}
              value={(f2Map.get("avg_overlap") ?? 0).toFixed(2)}
            />
            <Stat
              label={tx(lang, "f2_pct_top10")}
              value={`${((f2Map.get("pct_cited_in_top10") ?? 0) * 100).toFixed(1)}%`}
            />
          </div>
        </Section>

        {/* F3 */}
        <Section
          id="f3"
          eyebrow={tx(lang, "f3_eyebrow")}
          title={tx(lang, "f3_title")}
          takeaway={tx(lang, "f3_takeaway")}
        >
          <BarChartH
            data={f3Data.slice(0, 20).map((r) => ({
              label: r.domain,
              value: Number(r.citations),
              sub: `density ${Number(r.citation_density).toFixed(2)}`,
            }))}
            xLabel={tx(lang, "f3_x_label")}
            height={520}
            format="num"
          />
        </Section>

        {/* F4 */}
        <Section
          id="f4"
          eyebrow={tx(lang, "f4_eyebrow")}
          title={tx(lang, "f4_title")}
          takeaway={tx(lang, "f4_takeaway")}
        >
          <LineChart
            data={f4Data.map((r) => ({
              x: r.week.slice(0, 10),
              avg: Number(r.avg_chars),
              p50: Number(r.p50_chars),
              p90: Number(r.p90_chars),
            }))}
          />
        </Section>

        {/* F5 */}
        <Section
          id="f5"
          eyebrow={tx(lang, "f5_eyebrow")}
          title={tx(lang, "f5_title")}
          takeaway={tx(lang, "f5_takeaway")}
        >
          <BarChartH
            data={f5Data.slice(0, 13).map((r) => ({
              label: r.vertical,
              value: Number(r.aio_pct),
            }))}
            xLabel={tx(lang, "f5_x_label")}
            height={420}
            format="pct"
          />
        </Section>

        {/* F6 */}
        <Section
          id="f6"
          eyebrow={tx(lang, "f6_eyebrow")}
          title={tx(lang, "f6_title")}
          takeaway={tx(lang, "f6_takeaway")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            {Array.from(new Set(f6Data.map((r) => r.vertical)))
              .sort()
              .filter((v) => !vertical || v === vertical)
              .map((v) => {
                const rows = f6Data
                  .filter((r) => r.vertical === v)
                  .slice(0, 5);
                return (
                  <div key={v}>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-2">
                      {v}
                    </div>
                    <div className="space-y-1">
                      {rows.map((r) => (
                        <div
                          key={r.domain}
                          className="flex items-baseline justify-between text-sm border-b border-slate-100 py-1.5"
                        >
                          <span className="font-medium text-slate-900 truncate pr-2">
                            {r.rank_in_vertical}. {r.domain}
                          </span>
                          <span className="tabular-nums text-slate-500 text-xs">
                            {fmtNum(Number(r.citations))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </Section>

        {/* F7 */}
        <Section
          id="f7"
          eyebrow={tx(lang, "f7_eyebrow")}
          title={tx(lang, "f7_title")}
          takeaway={tx(lang, "f7_takeaway")}
        >
          <BarChartH
            data={f7Data.map((r) => ({
              label: r.vertical,
              value: Number(r.top10_share),
              sub: `top-1: ${r.top1_domain ?? "—"}`,
            }))}
            xLabel={tx(lang, "f7_x_label")}
            height={420}
            format="pct"
          />
        </Section>

        {/* F8 */}
        <Section
          id="f8"
          eyebrow={tx(lang, "f8_eyebrow")}
          title={tx(lang, "f8_title")}
          takeaway={tx(lang, "f8_takeaway")}
        >
          <BarChartH
            data={f8Data.map((r) => ({
              label: r.vertical,
              value: Number(r.pct_cited_in_top10) * 100,
            }))}
            xLabel={tx(lang, "f8_x_label")}
            height={420}
            format="pct"
          />
        </Section>

        {/* F9 */}
        <Section
          id="f9"
          eyebrow={tx(lang, "f9_eyebrow")}
          title={tx(lang, "f9_title")}
          takeaway={tx(lang, "f9_takeaway")}
        >
          <div className="space-y-2">
            {f9Data.map((r) => {
              const cited = Number(r.cited_value);
              const uncited = Number(r.uncited_value);
              const max = Math.max(cited, uncited, 1);
              return (
                <div
                  key={r.feature}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center py-2 border-b border-slate-100"
                >
                  <div className="text-sm font-medium text-slate-900">
                    {r.feature.replace(/^pct_|^avg_/, "").replace(/_/g, " ")}
                  </div>
                  <div className="w-48 sm:w-72 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] uppercase font-semibold text-slate-500 w-16">
                        {tx(lang, "f9_label_cited")}
                      </div>
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-indigo-600"
                          style={{ width: `${(cited / max) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] uppercase font-semibold text-slate-400 w-16">
                        {tx(lang, "f9_label_uncited")}
                      </div>
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-slate-300"
                          style={{ width: `${(uncited / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-xs tabular-nums text-slate-500 hidden md:block">
                    {r.feature.startsWith("pct_")
                      ? `${cited.toFixed(1)}% / ${uncited.toFixed(1)}%`
                      : `${cited.toFixed(1)} / ${uncited.toFixed(1)}`}
                  </div>
                  <div className="text-xs tabular-nums font-bold text-indigo-700 w-14 text-right">
                    {r.relative_diff_pct === null
                      ? "—"
                      : `${Number(r.relative_diff_pct) >= 0 ? "+" : ""}${Number(
                          r.relative_diff_pct,
                        ).toFixed(1)}%`}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-4">{tx(lang, "f9_caption")}</p>
        </Section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 text-sm text-slate-500">
          <p className="mb-2">
            {tx(lang, "footer_intro")}{" "}
            <a
              href="https://hoangducviet.work"
              className="text-indigo-600 hover:underline"
            >
              Hoang Duc Viet
            </a>{" "}
            {tx(lang, "footer_role")}{" "}
            <a
              href="https://seongon.com"
              className="text-indigo-600 hover:underline"
            >
              SEONGON
            </a>
            {tx(lang, "footer_after_role")}
          </p>
          <p>
            {tx(lang, "footer_code")}{" "}
            <a
              href="https://github.com/hdviettt/vn-aio-atlas"
              className="text-indigo-600 hover:underline"
            >
              github.com/hdviettt/vn-aio-atlas
            </a>{" "}
            · {tx(lang, "footer_findings")}{" "}
            <a
              href="https://github.com/hdviettt/vn-aio-atlas/blob/main/FINDINGS.md"
              className="text-indigo-600 hover:underline"
            >
              FINDINGS.md
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
