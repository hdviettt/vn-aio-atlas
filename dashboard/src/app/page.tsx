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
  f10,
  f11,
  f12,
  getCorpusSummary,
  getVerticals,
} from "@/lib/db";
import { isLang, type Lang, tx } from "@/lib/i18n";
import { BarChartH } from "@/components/charts/BarChartH";
import { BarChartV } from "@/components/charts/BarChartV";
import { LineChart } from "@/components/charts/LineChart";
import { Heatmap } from "@/components/charts/Heatmap";
import { Sparkline } from "@/components/charts/Sparkline";
import { Sidebar, type FindingNavItem } from "@/components/Sidebar";
import { FindingCard, Stat } from "@/components/FindingCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const fmtNum = (n: number) => Number(n).toLocaleString();

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
    f10Data,
    f11Data,
    f12Data,
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
    f10(),
    f11(),
    f12(vertical),
  ]);

  const f2Map = new Map(f2Data.map((r) => [r.metric, Number(r.value)]));

  // Pre-compute key stats from data
  const f1Max = f1Data.find((r) => r.bucket === "10+");
  const f1Min = f1Data.find((r) => r.bucket === "1-2");
  const f5MaxRow = f5Data[0];
  const f5MinRow = [...f5Data].sort((a, b) => Number(a.aio_pct) - Number(b.aio_pct))[0];
  const f7Max = [...f7Data].sort((a, b) => Number(b.top10_share) - Number(a.top10_share))[0];
  const f7Min = [...f7Data].sort((a, b) => Number(a.top10_share) - Number(b.top10_share))[0];
  const f8Min = [...f8Data].sort(
    (a, b) => Number(a.pct_cited_in_top10) - Number(b.pct_cited_in_top10),
  )[0];
  const f10Healthcare = f10Data.find((r) => r.vertical === "healthcare");
  const f10Jewelry = f10Data.find((r) => r.vertical === "jewelry");
  const f9Sitelinks = f9Data.find((r) => r.feature === "pct_has_sitelinks");
  const f11Banking = f11Data.find(
    (r) => r.vertical === "banking" && r.feature === "pct_has_sitelinks",
  );

  // Sidebar navigation
  const findings: FindingNavItem[] = [
    { id: "f1", number: "1", label: tx(lang, "f1_title").slice(0, 50) + "…" },
    { id: "f2", number: "2", label: tx(lang, "f2_title").slice(0, 50) + "…" },
    { id: "f3", number: "3", label: tx(lang, "f3_title").slice(0, 50) + "…" },
    { id: "f4", number: "4", label: tx(lang, "f4_title").slice(0, 50) + "…" },
    { id: "f5", number: "5", label: tx(lang, "f5_title").slice(0, 50) + "…" },
    { id: "f6", number: "6", label: tx(lang, "f6_title").slice(0, 50) + "…" },
    { id: "f7", number: "7", label: tx(lang, "f7_title").slice(0, 50) + "…" },
    { id: "f8", number: "8", label: tx(lang, "f8_title").slice(0, 50) + "…" },
    { id: "f9", number: "9", label: tx(lang, "f9_title").slice(0, 50) + "…" },
    { id: "f10", number: "10", label: tx(lang, "f10_title").slice(0, 50) + "…" },
    { id: "f11", number: "11", label: tx(lang, "f11_title").slice(0, 50) + "…" },
    { id: "f12", number: "12", label: tx(lang, "f12_title").slice(0, 50) + "…" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased md:flex">
      <Sidebar
        findings={findings}
        verticals={verticals}
        vertical={vertical}
        lang={lang}
        labels={{ all: tx(lang, "filter_all"), viewing: tx(lang, "filter_viewing") }}
      />

      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-4xl px-6 md:px-12 py-14 md:py-20">
          {/* Hero */}
          <header className="mb-16 md:mb-24">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600 mb-3">
              {tx(lang, "header_eyebrow")}
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.05]">
              {tx(lang, "header_title")}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mb-10">
              {tx(lang, "header_lede")}{" "}
              <strong className="text-slate-900">{fmtNum(summary.total_rows)}</strong>{" "}
              {tx(lang, "header_lede_q")}{" "}
              <strong className="text-slate-900">
                {fmtNum(summary.total_citations)}
              </strong>{" "}
              {tx(lang, "header_lede_c")}
            </p>

            {vertical && (
              <div className="mb-10 inline-flex items-center gap-2 text-sm bg-indigo-50 border-l-4 border-indigo-600 px-4 py-3">
                <span className="text-indigo-900">
                  {tx(lang, "vertical_banner_prefix")}{" "}
                  <strong>{vertical}</strong>
                </span>
                <a
                  href={lang === "en" ? "/" : "/?lang=vi"}
                  className="text-indigo-600 hover:underline ml-2 font-medium"
                >
                  {tx(lang, "vertical_banner_clear")}
                </a>
              </div>
            )}

            {/* Big-stat row — 4 columns on desktop, 2 on mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 pt-8 border-t border-slate-200">
              <Stat
                label={tx(lang, "stat_rows")}
                value={fmtNum(summary.total_rows)}
                size="large"
              />
              <Stat
                label={tx(lang, "stat_citations")}
                value={fmtNum(summary.total_citations)}
                size="large"
                sub={tx(lang, "stat_citations_sub")}
              />
              <Stat
                label={tx(lang, "stat_distinct_queries")}
                value={fmtNum(summary.distinct_keywords)}
                size="large"
              />
              <Stat
                label={tx(lang, "stat_brand_projects")}
                value={fmtNum(summary.distinct_projects)}
                size="large"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 mt-6">
              <Stat
                label={tx(lang, "stat_aio_positive")}
                value={fmtNum(summary.aio_rows)}
                size="small"
                sub={`${((summary.aio_rows / summary.total_rows) * 100).toFixed(0)}% ${tx(lang, "stat_aio_subtotal")}`}
              />
              <Stat
                label={tx(lang, "stat_verticals")}
                value={String(summary.distinct_verticals)}
                size="small"
              />
              <Stat
                label={tx(lang, "stat_from")}
                value={summary.earliest?.slice(0, 10) ?? "—"}
                size="small"
              />
              <Stat
                label={tx(lang, "stat_to")}
                value={summary.latest?.slice(0, 10) ?? "—"}
                size="small"
              />
            </div>
          </header>

          {/* F1 */}
          <FindingCard
            id="f1"
            eyebrow={tx(lang, "f1_eyebrow")}
            title={tx(lang, "f1_title")}
            takeaway={tx(lang, "f1_takeaway")}
            keyStat={
              f1Max && f1Min
                ? {
                    value: `${Number(f1Max.aio_pct).toFixed(1)}%`,
                    label: lang === "vi"
                      ? `truy vấn 10+ từ có AIO (so với ${Number(f1Min.aio_pct).toFixed(1)}% truy vấn 1-2 từ)`
                      : `of 10+ word queries get an AIO (vs only ${Number(f1Min.aio_pct).toFixed(1)}% of 1–2 word queries)`,
                  }
                : undefined
            }
          >
            <BarChartV
              data={f1Data.map((r) => ({
                label: r.bucket,
                value: Number(r.aio_pct),
              }))}
              yLabel={tx(lang, "f1_y_label")}
              format="pct"
            />
          </FindingCard>

          {/* F2 */}
          <FindingCard
            id="f2"
            eyebrow={tx(lang, "f2_eyebrow")}
            title={tx(lang, "f2_title")}
            takeaway={tx(lang, "f2_takeaway")}
            keyStat={{
              value: `${(100 - (f2Map.get("pct_cited_in_top10") ?? 0) * 100).toFixed(0)}%`,
              label: lang === "vi"
                ? "trích AIO đến từ ngoài top-10 organic"
                : "of AIO citations come from outside organic top-10",
            }}
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
          </FindingCard>

          {/* F3 */}
          <FindingCard
            id="f3"
            eyebrow={tx(lang, "f3_eyebrow")}
            title={tx(lang, "f3_title")}
            takeaway={tx(lang, "f3_takeaway")}
            keyStat={
              f3Data[0]
                ? {
                    value: Number(f3Data[0].citation_density).toFixed(1),
                    label: `${f3Data[0].domain} — ${
                      lang === "vi"
                        ? "trích trung bình mỗi truy vấn"
                        : "citations per distinct query"
                    }`,
                    sub: lang === "vi"
                      ? "Facebook chỉ 1.87, YouTube 1.65"
                      : "Compare: Facebook 1.87, YouTube 1.65",
                  }
                : undefined
            }
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
          </FindingCard>

          {/* F4 */}
          <FindingCard
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
          </FindingCard>

          {/* F5 */}
          <FindingCard
            id="f5"
            eyebrow={tx(lang, "f5_eyebrow")}
            title={tx(lang, "f5_title")}
            takeaway={tx(lang, "f5_takeaway")}
            keyStat={
              f5MaxRow && f5MinRow
                ? {
                    value: `${Number(f5MaxRow.aio_pct).toFixed(0)}% → ${Number(f5MinRow.aio_pct).toFixed(0)}%`,
                    label: lang === "vi"
                      ? `${f5MaxRow.vertical} → ${f5MinRow.vertical}`
                      : `${f5MaxRow.vertical} → ${f5MinRow.vertical}`,
                    sub: lang === "vi"
                      ? "khoảng cách ~50pp giữa ngành thông tin nhất và thương mại nhất"
                      : "~50pp gap between most-informational and most-transactional verticals",
                  }
                : undefined
            }
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
          </FindingCard>

          {/* F6 */}
          <FindingCard
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
                  const rows = f6Data.filter((r) => r.vertical === v).slice(0, 5);
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
          </FindingCard>

          {/* F7 */}
          <FindingCard
            id="f7"
            eyebrow={tx(lang, "f7_eyebrow")}
            title={tx(lang, "f7_title")}
            takeaway={tx(lang, "f7_takeaway")}
            keyStat={
              f7Max && f7Min
                ? {
                    value: `${Number(f7Max.top10_share).toFixed(0)}% → ${Number(f7Min.top10_share).toFixed(0)}%`,
                    label: lang === "vi"
                      ? `${f7Max.vertical} → ${f7Min.vertical}`
                      : `${f7Max.vertical} → ${f7Min.vertical}`,
                    sub: lang === "vi"
                      ? `khoảng cách giữa thị trường tập trung nhất và phân mảnh nhất`
                      : "spread between most-concentrated and most-fragmented markets",
                  }
                : undefined
            }
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
          </FindingCard>

          {/* F8 */}
          <FindingCard
            id="f8"
            eyebrow={tx(lang, "f8_eyebrow")}
            title={tx(lang, "f8_title")}
            takeaway={tx(lang, "f8_takeaway")}
            keyStat={
              f8Min
                ? {
                    value: `${(Number(f8Min.pct_cited_in_top10) * 100).toFixed(0)}%`,
                    label: lang === "vi"
                      ? `${f8Min.vertical}: AIO trích từ ngoài top-10 nhiều nhất`
                      : `${f8Min.vertical}: where AIO reaches outside top-10 the most`,
                  }
                : undefined
            }
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
          </FindingCard>

          {/* F9 */}
          <FindingCard
            id="f9"
            eyebrow={tx(lang, "f9_eyebrow")}
            title={tx(lang, "f9_title")}
            takeaway={tx(lang, "f9_takeaway")}
            keyStat={
              f9Sitelinks
                ? {
                    value: `${(Number(f9Sitelinks.relative_diff_pct) / 100 + 1).toFixed(1)}×`,
                    label: lang === "vi"
                      ? "URL có sitelinks được trích nhiều hơn URL không có"
                      : "more often cited: URLs with sitelinks vs URLs without",
                  }
                : undefined
            }
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
                    <div
                      className={`text-xs tabular-nums font-bold w-14 text-right ${
                        r.relative_diff_pct === null
                          ? "text-slate-400"
                          : Number(r.relative_diff_pct) > 0
                            ? "text-indigo-700"
                            : "text-rose-600"
                      }`}
                    >
                      {r.relative_diff_pct === null
                        ? "—"
                        : `${Number(r.relative_diff_pct) >= 0 ? "+" : ""}${Number(r.relative_diff_pct).toFixed(1)}%`}
                    </div>
                  </div>
                );
              })}
            </div>
          </FindingCard>

          {/* F10 */}
          <FindingCard
            id="f10"
            eyebrow={tx(lang, "f10_eyebrow")}
            title={tx(lang, "f10_title")}
            takeaway={tx(lang, "f10_takeaway")}
            keyStat={
              f10Healthcare && f10Jewelry
                ? {
                    value: `${(f10Healthcare.avg_md_chars / f10Jewelry.avg_md_chars).toFixed(2)}×`,
                    label: lang === "vi"
                      ? `câu trả lời y tế dài hơn trang sức (${fmtNum(f10Healthcare.avg_md_chars)} so với ${fmtNum(f10Jewelry.avg_md_chars)} ký tự)`
                      : `healthcare AIOs vs jewelry AIOs (${fmtNum(f10Healthcare.avg_md_chars)} vs ${fmtNum(f10Jewelry.avg_md_chars)} chars)`,
                  }
                : undefined
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  {tx(lang, "f10_x_label_chars")}
                </div>
                <BarChartH
                  data={f10Data.map((r) => ({
                    label: r.vertical,
                    value: Number(r.avg_md_chars),
                  }))}
                  height={420}
                  format="num"
                />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  {tx(lang, "f10_x_label_refs")}
                </div>
                <BarChartH
                  data={f10Data.map((r) => ({
                    label: r.vertical,
                    value: Number(r.avg_refs_per_aio),
                  }))}
                  height={420}
                  format="raw"
                />
              </div>
            </div>
          </FindingCard>

          {/* F11 — heatmap */}
          <FindingCard
            id="f11"
            eyebrow={tx(lang, "f11_eyebrow")}
            title={tx(lang, "f11_title")}
            takeaway={tx(lang, "f11_takeaway")}
            keyStat={
              f11Banking
                ? {
                    value: `+${Number(f11Banking.relative_diff_pct).toFixed(0)}%`,
                    label: lang === "vi"
                      ? "tín hiệu sitelinks mạnh nhất ở ngành ngân hàng (so với +116% ở lifestyle)"
                      : "strongest sitelinks effect in banking (vs +116% in lifestyle)",
                  }
                : undefined
            }
          >
            {(() => {
              const featureOrder = [
                "pct_has_sitelinks",
                "avg_rank_absolute",
                "pct_has_rating",
                "pct_has_price",
                "pct_has_highlighted",
                "avg_description_length",
                "avg_title_length",
              ];
              const featureLabels: Record<string, string> = {
                pct_has_sitelinks: "sitelinks",
                avg_rank_absolute: "rank",
                pct_has_rating: "rating",
                pct_has_price: "price",
                pct_has_highlighted: "highlighted",
                avg_description_length: "desc len",
                avg_title_length: "title len",
              };
              const sitelinks = new Map(
                f11Data
                  .filter((r) => r.feature === "pct_has_sitelinks")
                  .map((r) => [r.vertical, Number(r.relative_diff_pct ?? 0)]),
              );
              const verticalsSorted = Array.from(sitelinks.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([v]) => v);
              const cells = f11Data.map((r) => ({
                row: r.vertical,
                col: r.feature,
                value:
                  r.relative_diff_pct === null
                    ? null
                    : r.feature === "avg_rank_absolute" ||
                        r.feature === "pct_has_price"
                      ? -Number(r.relative_diff_pct) // invert: lower rank/no price = better for cited
                      : Number(r.relative_diff_pct),
              }));
              return (
                <Heatmap
                  data={cells}
                  rowOrder={verticalsSorted}
                  colOrder={featureOrder}
                  colLabels={featureLabels}
                  format="pct_diff"
                />
              );
            })()}
            <p className="text-xs text-slate-500 mt-4">{tx(lang, "f11_caption")}</p>
          </FindingCard>

          {/* F12 — share-of-voice over time */}
          <FindingCard
            id="f12"
            eyebrow={tx(lang, "f12_eyebrow")}
            title={tx(lang, "f12_title")}
            takeaway={tx(lang, "f12_takeaway")}
            keyStat={{
              value: "−2.8pp",
              label: lang === "vi"
                ? "Techcombank: thị phần trích AIO ngân hàng tháng 4/2026 vs tháng 12/2025"
                : "Techcombank: April vs December banking AIO share",
              sub: lang === "vi"
                ? "thị phần dẫn đầu ngân hàng giảm 4 tháng liên tiếp"
                : "the only major shift in an otherwise stable hierarchy",
            }}
          >
            {(() => {
              const byVerticalDomain = new Map<
                string,
                Map<string, { month: string; share: number }[]>
              >();
              for (const r of f12Data) {
                if (!byVerticalDomain.has(r.vertical))
                  byVerticalDomain.set(r.vertical, new Map());
                const dmap = byVerticalDomain.get(r.vertical)!;
                if (!dmap.has(r.domain)) dmap.set(r.domain, []);
                dmap.get(r.domain)!.push({
                  month: r.month.slice(0, 7),
                  share: Number(r.share_pct),
                });
              }
              const verticalsToShow = vertical
                ? [vertical].filter((v) => byVerticalDomain.has(v))
                : Array.from(byVerticalDomain.keys()).sort();
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                  {verticalsToShow.map((v) => {
                    const dmap = byVerticalDomain.get(v)!;
                    const domainEntries = Array.from(dmap.entries())
                      .map(([domain, points]) => {
                        const sorted = [...points].sort((a, b) =>
                          a.month.localeCompare(b.month),
                        );
                        const first = sorted[0]?.share ?? 0;
                        const last = sorted[sorted.length - 1]?.share ?? 0;
                        return {
                          domain,
                          points: sorted,
                          first,
                          last,
                          delta: last - first,
                        };
                      })
                      .sort((a, b) => b.last - a.last);
                    return (
                      <div key={v}>
                        <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-2">
                          {v}
                        </div>
                        <div className="space-y-1">
                          {domainEntries.map((d) => (
                            <div
                              key={d.domain}
                              className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center text-sm border-b border-slate-100 py-1.5"
                            >
                              <span className="font-medium text-slate-900 truncate pr-2">
                                {d.domain}
                              </span>
                              <Sparkline values={d.points.map((p) => p.share)} />
                              <span className="tabular-nums text-xs text-slate-500 w-12 text-right">
                                {d.last.toFixed(1)}%
                              </span>
                              <span
                                className={`tabular-nums text-xs font-bold w-14 text-right ${
                                  d.delta > 0.3
                                    ? "text-emerald-600"
                                    : d.delta < -0.3
                                      ? "text-rose-600"
                                      : "text-slate-400"
                                }`}
                              >
                                {d.delta >= 0 ? "+" : ""}
                                {d.delta.toFixed(1)}pp
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            <p className="text-xs text-slate-500 mt-4">{tx(lang, "f12_caption")}</p>
          </FindingCard>

          {/* Footer */}
          <footer className="mt-20 pt-10 border-t border-slate-200 text-sm text-slate-500">
            <p className="mb-3">
              {tx(lang, "footer_intro")}{" "}
              <a
                href="https://hoangducviet.work"
                className="text-indigo-600 hover:underline font-medium"
              >
                Hoang Duc Viet
              </a>{" "}
              {tx(lang, "footer_role")}{" "}
              <a
                href="https://seongon.com"
                className="text-indigo-600 hover:underline font-medium"
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
    </div>
  );
}
