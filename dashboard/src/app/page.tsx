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
} from "@/lib/db";
import { BarChartH } from "@/components/charts/BarChartH";
import { BarChartV } from "@/components/charts/BarChartV";
import { LineChart } from "@/components/charts/LineChart";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const fmtNum = (n: number) => Number(n).toLocaleString();
const fmtPct = (n: number) => `${Number(n).toFixed(1)}%`;

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

export default async function Home() {
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
    f1(),
    f2(),
    f3(),
    f4(),
    f5(),
    f6(),
    f7(),
    f8(),
    f9(),
  ]);

  const f2Map = new Map(f2Data.map((r) => [r.metric, Number(r.value)]));

  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Hero */}
        <header className="mb-16">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600 mb-3">
            atlas · preliminary findings
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-5">
            Vietnam AI Overview Atlas
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            An empirical study of how Google&apos;s AI Overviews behave on
            Vietnamese commercial search, backed by{" "}
            <strong className="text-slate-900">
              {fmtNum(summary.total_rows)}
            </strong>{" "}
            query observations and{" "}
            <strong className="text-slate-900">
              {fmtNum(summary.total_citations)}
            </strong>{" "}
            citation events from December 2025 through April 2026.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 mt-12">
            <Stat label="rows" value={fmtNum(summary.total_rows)} />
            <Stat
              label="aio-positive"
              value={fmtNum(summary.aio_rows)}
              sub={`${((summary.aio_rows / summary.total_rows) * 100).toFixed(0)}% of total`}
            />
            <Stat
              label="distinct queries"
              value={fmtNum(summary.distinct_keywords)}
            />
            <Stat label="brand projects" value={fmtNum(summary.distinct_projects)} />
            <Stat label="verticals" value={String(summary.distinct_verticals)} />
            <Stat
              label="citations"
              value={fmtNum(summary.total_citations)}
              sub="across all AIO answers"
            />
            <Stat
              label="from"
              value={summary.earliest?.slice(0, 10) ?? "—"}
            />
            <Stat label="to" value={summary.latest?.slice(0, 10) ?? "—"} />
          </div>
        </header>

        {/* F1 */}
        <Section
          id="f1"
          eyebrow="finding 1"
          title="AI Overviews appear 2.5× more often on long-tail queries than head terms"
          takeaway="Queries of 10+ words get an AI Overview 80.8% of the time; 1–2 word queries only 32.8%. The relationship is monotonic across all five buckets — long-tail queries are the AIO-rich tail of Vietnamese commercial search."
        >
          <BarChartV
            data={f1Data.map((r) => ({
              label: r.bucket,
              value: Number(r.aio_pct),
            }))}
            yLabel="AIO presence rate (%)"
            format="pct"
          />
        </Section>

        {/* F2 */}
        <Section
          id="f2"
          eyebrow="finding 2"
          title="40% of AI Overview citations come from outside the organic top 10"
          takeaway="Across 153K AIO-positive SERPs, an average AIO cites 7.4 distinct domains; only 4.3 of those rank in the organic top 10. The remaining 40% come from lower ranks or aren't ranked organically for that query at all."
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat
              label="rows analyzed"
              value={fmtNum(f2Map.get("rows_analyzed") ?? 0)}
            />
            <Stat
              label="avg cited / query"
              value={(f2Map.get("avg_cited") ?? 0).toFixed(2)}
            />
            <Stat
              label="avg overlap"
              value={(f2Map.get("avg_overlap") ?? 0).toFixed(2)}
            />
            <Stat
              label="% in top-10"
              value={`${((f2Map.get("pct_cited_in_top10") ?? 0) * 100).toFixed(1)}%`}
            />
          </div>
        </Section>

        {/* F3 */}
        <Section
          id="f3"
          eyebrow="finding 3"
          title="Banks own their queries deeply. UGC platforms get cited thinly."
          takeaway="Citation density (citations / distinct keywords) splits cleanly: Vietnamese banks like Techcombank (4.71) and MB (4.39) are cited multiple times within the same AI Overview answer. Facebook (1.87) and YouTube (1.65) appear in many SERPs but rarely cited deeply — a measurable AIO devaluation of UGC content."
        >
          <BarChartH
            data={f3Data.slice(0, 20).map((r) => ({
              label: r.domain,
              value: Number(r.citations),
              sub: `density ${Number(r.citation_density).toFixed(2)}`,
            }))}
            xLabel="AIO citations"
            height={520}
            format="num"
          />
        </Section>

        {/* F4 */}
        <Section
          id="f4"
          eyebrow="finding 4"
          title="AI Overview length is roughly stable over five months"
          takeaway="Weekly average AIO length drifted from ~4,300 chars to ~4,200 chars (−2.8%) over December 2025 → April 2026. Real but small. Reported as a null finding."
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
          eyebrow="finding 5"
          title="AIO presence varies dramatically by client vertical"
          takeaway="Education (83%), healthcare (81%), and banking (77%) trigger AI Overviews far more than retail (34%) or construction (48%). Information-heavy verticals are AIO-saturated; commercial / transactional verticals are not."
        >
          <BarChartH
            data={f5Data.slice(0, 13).map((r) => ({
              label: r.vertical,
              value: Number(r.aio_pct),
            }))}
            xLabel="AIO presence (%)"
            height={420}
            format="pct"
          />
        </Section>

        {/* F6 */}
        <Section
          id="f6"
          eyebrow="finding 6"
          title="Each vertical has its own AIO citation hierarchy"
          takeaway="The top cited domains within each vertical reveal who owns AIO citations in their market. Banks dominate banking; Long Châu / Vinmec / Medlatec dominate healthcare; GHN / Viettel Post / GHTK own logistics."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            {Array.from(new Set(f6Data.map((r) => r.vertical)))
              .sort()
              .map((vertical) => {
                const rows = f6Data
                  .filter((r) => r.vertical === vertical)
                  .slice(0, 5);
                return (
                  <div key={vertical}>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-2">
                      {vertical}
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
          eyebrow="finding 7"
          title="Citation concentration varies dramatically by vertical"
          takeaway="In jewelry and healthcare, the top 10 domains capture ~46–49% of all AIO citations — concentrated markets. In construction and software, the top 10 only capture 13–15% — long-tail markets. The same SEO playbook can&apos;t work in both."
        >
          <BarChartH
            data={f7Data.map((r) => ({
              label: r.vertical,
              value: Number(r.top10_share),
              sub: `top-1: ${r.top1_domain ?? "—"}`,
            }))}
            xLabel="% of citations going to top 10 domains"
            height={420}
            format="pct"
          />
        </Section>

        {/* F8 */}
        <Section
          id="f8"
          eyebrow="finding 8"
          title="In long-tail verticals, ranking organically isn&apos;t enough"
          takeaway="The global F2 number (59% AIO ↔ top-10 overlap) hides a clean split. Healthcare (67%), banking (61%): AIO mostly cites organic top-10. Tourism (47%), education (51%): AIO reaches well outside top-10 to find sources."
        >
          <BarChartH
            data={f8Data.map((r) => ({
              label: r.vertical,
              value: Number(r.pct_cited_in_top10) * 100,
            }))}
            xLabel="% of AIO citations also in organic top-10"
            height={420}
            format="pct"
          />
        </Section>

        {/* F9 */}
        <Section
          id="f9"
          eyebrow="finding 9"
          title="Sitelinks are the single largest signal of AIO citation"
          takeaway="URLs with sitelinks are cited 3.1× more often than URLs without (13.2% vs 4.2%). Cited URLs rank ~5 positions higher on average (rank 8.5 vs 13.5). Title and description length differences are tiny (~3%) and not the lever to pull."
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
                        cited
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
                        uncited
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
          <p className="text-xs text-slate-500 mt-4">
            Sample: 10,000 random AIO-positive SERPs → 179,201 organic URLs
            (45,878 cited, 133,323 uncited). <code>has_price</code> excluded
            due to a known SQL extraction bug; fix landed in pull.py for the
            next refresh.
          </p>
        </Section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 text-sm text-slate-500">
          <p className="mb-2">
            Workspace led by{" "}
            <a
              href="https://hoangducviet.work"
              className="text-indigo-600 hover:underline"
            >
              Hoang Duc Viet
            </a>{" "}
            (AI lead at{" "}
            <a
              href="https://seongon.com"
              className="text-indigo-600 hover:underline"
            >
              SEONGON
            </a>
            ). Dataset is SEONGON&apos;s; methodology and analysis are mine.
          </p>
          <p>
            Code:{" "}
            <a
              href="https://github.com/hdviettt/vn-aio-atlas"
              className="text-indigo-600 hover:underline"
            >
              github.com/hdviettt/vn-aio-atlas
            </a>{" "}
            · Findings doc:{" "}
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
