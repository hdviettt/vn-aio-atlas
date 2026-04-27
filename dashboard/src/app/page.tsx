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
import { BarV } from "@/components/charts/visx/BarV";
import { BarH } from "@/components/charts/visx/BarH";
import { LineChart as VisxLine } from "@/components/charts/visx/Line";
import { Heatmap } from "@/components/charts/Heatmap";
import { Sparkline } from "@/components/charts/Sparkline";
import { RatioBar } from "@/components/charts/RatioBar";
import { MiniBars } from "@/components/charts/MiniBars";
import { SectionMap } from "@/components/SectionMap";
import { ChartFigure } from "@/components/charts/ChartFigure";
import { Sidebar, type SidebarItem } from "@/components/Sidebar";
import { ReadingProgress } from "@/components/ReadingProgress";
import { FindingCard } from "@/components/FindingCard";
import { FindingAnalysis } from "@/components/FindingAnalysis";
import { SectionDivider } from "@/components/SectionDivider";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { Glossary } from "@/components/Glossary";
import { StudyClosing, ClosingBlock } from "@/components/StudyClosing";
import { AtlasFooter } from "@/components/AtlasFooter";
import {
  findingMeaning,
  findingMethod,
  linkifyFindingRefs,
} from "@/lib/findingAnalysis";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Num } from "@/components/ui/Num";
import { DataRow } from "@/components/ui/DataRow";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const f2Map = new Map(f2Data.map((r) => [r.metric, Number(r.value) as unknown as number]));
  const getF2 = (k: string) => Number(f2Map.get(k) ?? 0);

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

  // F13 — cross-vertical citation leaders, derived from F6 data.
  // For each domain that appears in any vertical's top-5 cited list,
  // count how many verticals it appears in (with rank ≤ 5).
  const f13Tally = new Map<string, { reach: number; totalCitations: number; verticals: string[] }>();
  for (const r of f6Data) {
    if (r.rank_in_vertical > 5) continue;
    const cur = f13Tally.get(r.domain) ?? {
      reach: 0,
      totalCitations: 0,
      verticals: [],
    };
    cur.reach += 1;
    cur.totalCitations += Number(r.citations);
    cur.verticals.push(r.vertical);
    f13Tally.set(r.domain, cur);
  }
  const f13Data = Array.from(f13Tally.entries())
    .map(([domain, info]) => ({ domain, ...info }))
    .sort(
      (a, b) => b.reach - a.reach || b.totalCitations - a.totalCitations,
    )
    .slice(0, 15);
  const f13Top = f13Data[0];

  // Sidebar navigation — short labels.
  const navLabels =
    lang === "vi"
      ? {
          f1: "Truy vấn dài & AIO",
          f2: "Trích ngoài top 10",
          f3: "Mật độ trích nguồn",
          f4: "Độ dài AIO theo thời gian",
          f5: "AIO theo ngành",
          f6: "Top trích theo ngành",
          f7: "Tập trung trích",
          f8: "Trùng lặp top-10",
          f9: "URL được trích",
          f10: "Đặc trưng AIO",
          f11: "Tín hiệu theo ngành",
          f12: "Thị phần theo thời gian",
          f13: "Lãnh đạo xuyên ngành",
        }
      : {
          f1: "Long-tail & AIO presence",
          f2: "Citations outside top 10",
          f3: "Citation density",
          f4: "AIO length over time",
          f5: "AIO rate by vertical",
          f6: "Top cited per vertical",
          f7: "Citation concentration",
          f8: "Top-10 overlap by vertical",
          f9: "What gets cited",
          f10: "AIO answer characteristics",
          f11: "Per-vertical signals",
          f12: "Share-of-voice over time",
          f13: "Cross-vertical citation leaders",
        };
  const sectionLabels =
    lang === "vi"
      ? {
          "section-i": "AIO xuất hiện ở đâu",
          "section-ii": "Kinh tế trích dẫn",
          "section-iii": "Theo ngành",
          "section-iv": "Tín hiệu",
          "section-v": "Thị phần theo thời gian",
          "section-vi": "Phương pháp",
          "section-vii": "Giới hạn",
          "section-viii": "Kết & câu hỏi mở",
        }
      : {
          "section-i": "Where AIO appears",
          "section-ii": "Citation economics",
          "section-iii": "The vertical view",
          "section-iv": "Signals",
          "section-v": "Movement over time",
          "section-vi": "Methodology",
          "section-vii": "Limitations",
          "section-viii": "Closing",
        };

  const sidebarItems: SidebarItem[] = [
    { kind: "section", id: "section-i", number: "I", label: sectionLabels["section-i"] },
    { kind: "finding", id: "f1", number: "1", label: navLabels.f1 },
    { kind: "section", id: "section-ii", number: "II", label: sectionLabels["section-ii"] },
    { kind: "finding", id: "f2", number: "2", label: navLabels.f2 },
    { kind: "finding", id: "f3", number: "3", label: navLabels.f3 },
    { kind: "finding", id: "f4", number: "4", label: navLabels.f4 },
    { kind: "section", id: "section-iii", number: "III", label: sectionLabels["section-iii"] },
    { kind: "finding", id: "f5", number: "5", label: navLabels.f5 },
    { kind: "finding", id: "f6", number: "6", label: navLabels.f6 },
    { kind: "finding", id: "f7", number: "7", label: navLabels.f7 },
    { kind: "finding", id: "f8", number: "8", label: navLabels.f8 },
    { kind: "section", id: "section-iv", number: "IV", label: sectionLabels["section-iv"] },
    { kind: "finding", id: "f9", number: "9", label: navLabels.f9 },
    { kind: "finding", id: "f10", number: "10", label: navLabels.f10 },
    { kind: "finding", id: "f11", number: "11", label: navLabels.f11 },
    { kind: "finding", id: "f13", number: "13", label: navLabels.f13 },
    { kind: "section", id: "section-v", number: "V", label: sectionLabels["section-v"] },
    { kind: "finding", id: "f12", number: "12", label: navLabels.f12 },
    { kind: "section", id: "section-vi", number: "VI", label: sectionLabels["section-vi"] },
    { kind: "section", id: "section-vii", number: "VII", label: sectionLabels["section-vii"] },
    { kind: "section", id: "section-viii", number: "VIII", label: sectionLabels["section-viii"] },
  ];

  // Source line — used at the bottom of every ChartFigure.
  const sourceLine =
    lang === "vi"
      ? `Nguồn: hệ thống tracking SERP của SEONGON · ${summary.earliest?.slice(0, 10)} → ${summary.latest?.slice(0, 10)}`
      : `Source: SEONGON SERP-tracking pipeline · ${summary.earliest?.slice(0, 10)} → ${summary.latest?.slice(0, 10)}`;

  // Shared FindingAnalysis labels — kept here so the JSX stays terse.
  const meaningLabel = lang === "vi" ? "ý nghĩa thực tế" : "what this means";
  const methodLabel = lang === "vi" ? "ghi chú phương pháp" : "method note";

  return (
    <div className="min-h-screen bg-page text-ink antialiased md:flex">
      <ReadingProgress
        label={lang === "vi" ? "Lên đầu trang" : "Back to top"}
      />
      <Sidebar
        items={sidebarItems}
        verticals={verticals}
        vertical={vertical}
        lang={lang}
        labels={{
          all: tx(lang, "filter_all"),
          viewing: tx(lang, "filter_viewing"),
          languageLabel: lang === "vi" ? "ngôn ngữ" : "language",
        }}
      />

      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-4xl px-6 md:px-12 py-14 md:py-20">
          {/* ── Hero ────────────────────────────────────────────── */}
          <header className="mb-16 md:mb-24">
            {/* Issue strip: series · volume · date */}
            <div className="flex items-center justify-between gap-4 pb-6 mb-10 border-b border-line animate-fade-in-up">
              <div className="flex items-baseline gap-3 flex-wrap">
                <Eyebrow tone="accent">{tx(lang, "header_eyebrow")}</Eyebrow>
                <span className="text-ink-4 text-[11px]">·</span>
                <span className="font-mono-num text-[11px] text-ink-3 uppercase tracking-[0.18em]">
                  {lang === "vi" ? "Tập I" : "Volume I"}
                </span>
              </div>
              {summary.latest && (
                <div className="font-mono-num text-[11px] text-ink-3">
                  {summary.latest.slice(0, 10)}
                </div>
              )}
            </div>

            {/* H1 = project identity. The Atlas IS the work; the findings unpack it below. */}
            <h1 className="font-display-tight text-[52px] md:text-[88px] font-bold text-ink mb-8 leading-[0.98] tracking-[-0.035em] animate-fade-in-up-delay-1">
              {lang === "vi"
                ? "Atlas AI Overview Việt Nam."
                : "Vietnam AI Overview Atlas."}
            </h1>

            {/* Standfirst — what this study actually contributes */}
            <p className="text-[20px] md:text-[26px] text-ink leading-[1.3] tracking-[-0.01em] mb-10 max-w-3xl font-medium animate-fade-in-up-delay-2">
              {lang === "vi" ? (
                <>
                  Mười hai phát hiện về <em className="not-italic text-accent">cách AIO thực sự hành xử</em> trên tìm kiếm thương mại Việt Nam — trích cái gì, ưu ái ai, và điều gì đã ổn định.
                </>
              ) : (
                <>
                  Twelve findings on <em className="not-italic text-accent">how AI Overviews actually behave</em> on Vietnamese commercial search — what they cite, who they reward, and what's already settled.
                </>
              )}
            </p>

            {/* Byline — small caps mono, magazine-style */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-12 text-[11px] font-mono-num uppercase tracking-[0.18em] text-ink-3 animate-fade-in-up-delay-2">
              <span>
                {lang === "vi" ? "bởi" : "by"}{" "}
                <a
                  href="https://hoangducviet.work"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-accent font-semibold"
                >
                  Hoang Duc Viet
                </a>
              </span>
              <span className="text-ink-4">·</span>
              <a
                href="https://seongon.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                SEONGON
              </a>
              <span className="text-ink-4">·</span>
              <span>
                {lang === "vi" ? "Tháng 4 / 2026" : "April 2026"}
              </span>
            </div>

            {/* Lede — explicitly acknowledges AIO isn't new; frames the contribution */}
            {(() => {
              const yearStart = summary.earliest?.slice(0, 4) ?? "—";
              const yearEnd = summary.latest?.slice(0, 4) ?? "—";
              return (
                <p className="text-[17px] md:text-[19px] text-ink-2 leading-relaxed max-w-3xl mb-14 animate-fade-in-up-delay-3">
                  {lang === "vi" ? (
                    <>
                      AIO không phải điều mới — nó đã là bề mặt dẫn dắt kết quả Google tại Việt Nam suốt nhiều tháng. Điều vẫn chưa được lập bản đồ là <strong className="text-ink font-semibold">AIO thực sự hành xử thế nào khi không ai bảo nó phải làm gì</strong>: trích từ đâu, tại sao thị phần trích chênh lệch gấp mười lần giữa các ngành, và tín hiệu nào vượt qua top-10 organic để được nhặt lên. Giữa tháng 12 / {yearStart} và tháng 4 / {yearEnd}, Atlas này theo dõi {summary.distinct_keywords.toLocaleString("en-US")} truy vấn duy nhất trên 264 dự án thương hiệu Việt Nam để trả lời.
                    </>
                  ) : (
                    <>
                      AI Overviews aren't new — they've been the lead surface of Google's results in Vietnam for months. What's still uncharted is <strong className="text-ink font-semibold">how AIO actually behaves when nobody tells it what to do</strong>: what it cites, why citation share varies tenfold between verticals, and which signals route past the organic top-10 to be picked up. Between December {yearStart} and April {yearEnd}, this Atlas tracked {summary.distinct_keywords.toLocaleString("en-US")} distinct queries across 264 Vietnamese brand projects to find out.
                    </>
                  )}
                </p>
              );
            })()}

            {vertical && (
              <div className="mb-10 max-w-3xl">
                <p className="text-[14px] text-ink-3 leading-relaxed">
                  <Eyebrow tone="accent" as="span" className="mr-2 align-middle">
                    {lang === "vi" ? "đang xem" : "viewing"}
                  </Eyebrow>
                  <span className="text-ink font-semibold">{vertical}</span>
                  <span className="mx-2 text-ink-4">·</span>
                  <a
                    href={lang === "en" ? "/" : "/?lang=vi"}
                    className="text-accent hover:underline"
                  >
                    {tx(lang, "vertical_banner_clear")}
                  </a>
                </p>
                <p className="text-[12px] text-ink-3 leading-relaxed mt-2">
                  {lang === "vi" ? (
                    <>
                      Bộ lọc áp dụng cho{" "}
                      <a href="#f1" className="text-accent hover:underline">F1</a>,{" "}
                      <a href="#f3" className="text-accent hover:underline">F3</a>,{" "}
                      <a href="#f4" className="text-accent hover:underline">F4</a>,{" "}
                      <a href="#f6" className="text-accent hover:underline">F6</a>,{" "}
                      <a href="#f12" className="text-accent hover:underline">F12</a>
                      . Các phát hiện so sánh giữa ngành đánh dấu nổi bật ngành{" "}
                      <span className="text-ink font-semibold">{vertical}</span>{" "}
                      khi có mặt.
                    </>
                  ) : (
                    <>
                      Filter applies to{" "}
                      <a href="#f1" className="text-accent hover:underline">F1</a>,{" "}
                      <a href="#f3" className="text-accent hover:underline">F3</a>,{" "}
                      <a href="#f4" className="text-accent hover:underline">F4</a>,{" "}
                      <a href="#f6" className="text-accent hover:underline">F6</a>,{" "}
                      <a href="#f12" className="text-accent hover:underline">F12</a>
                      . Cross-vertical comparisons highlight{" "}
                      <span className="text-ink font-semibold">{vertical}</span>{" "}
                      where present.
                    </>
                  )}
                </p>
              </div>
            )}

            {/* Headline finding callout — one striking visual hook above the fold. */}
            {(() => {
              const outsideTopTen = 100 - getF2("pct_cited_in_top10") * 100;
              const insideTopTen = 100 - outsideTopTen;
              return (
                <div className="border-y border-line-strong py-10 md:py-12 mb-12 animate-fade-in-up-delay-3">
                  <Eyebrow tone="accent" className="mb-5">
                    {lang === "vi" ? "phát hiện tiêu điểm" : "headline finding"}
                  </Eyebrow>
                  <div className="grid grid-cols-1 md:grid-cols-[8rem_1fr] gap-6 md:gap-12 items-baseline mb-8">
                    <div className="font-num text-[64px] md:text-[80px] font-bold text-accent leading-none tracking-[-0.03em] tabular-nums">
                      {outsideTopTen.toFixed(0)}%
                    </div>
                    <div>
                      <p className="font-display-tight text-[22px] md:text-[28px] font-semibold text-ink leading-[1.2] tracking-[-0.015em] mb-2">
                        {lang === "vi"
                          ? "trích dẫn AIO đến từ ngoài top-10 organic của Google."
                          : "of AI Overview citations come from outside Google's organic top-10."}
                      </p>
                      <p className="text-[14px] text-ink-3 leading-relaxed max-w-xl">
                        {lang === "vi"
                          ? "Xếp hạng trang 1 vẫn cần thiết — nhưng không còn là tín hiệu chính của AIO. Đây là hiện trạng cấu trúc nhất của Atlas này."
                          : "Page-1 ranking is still necessary — but no longer AIO's primary signal. The single most structural finding in this Atlas."}
                      </p>
                    </div>
                  </div>
                  <div className="md:pl-[9rem]">
                    <RatioBar
                      left={{
                        value: insideTopTen,
                        label:
                          lang === "vi"
                            ? "trong top-10 organic"
                            : "inside organic top-10",
                      }}
                      right={{
                        value: outsideTopTen,
                        label:
                          lang === "vi"
                            ? "ngoài top-10 organic"
                            : "outside organic top-10",
                      }}
                      height={28}
                    />
                    <div className="mt-5 flex items-center justify-end">
                      <a
                        href="#f2"
                        className="font-mono-num text-[11px] uppercase tracking-[0.18em] text-accent hover:underline"
                      >
                        {lang === "vi" ? "→ Phát hiện 02" : "→ Read finding 02"}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Metadata strip — single horizontal mono line. Pew/NYT pattern. */}
            <div className="pt-8 border-t border-line animate-fade-in-up-delay-3">
              <Eyebrow tone="muted" className="mb-3">
                {lang === "vi" ? "phạm vi nghiên cứu" : "study scope"}
              </Eyebrow>
              <div className="font-mono-num text-[12px] text-ink-2 leading-relaxed flex flex-wrap gap-x-5 gap-y-1.5">
                <span>
                  <span className="text-ink font-semibold">
                    {summary.total_rows.toLocaleString("en-US")}
                  </span>{" "}
                  {lang === "vi" ? "quan sát truy vấn" : "query observations"}
                </span>
                <span className="text-ink-4">·</span>
                <span>
                  <span className="text-ink font-semibold">
                    {summary.total_citations.toLocaleString("en-US")}
                  </span>{" "}
                  {lang === "vi" ? "lượt trích AIO" : "AIO citations"}
                </span>
                <span className="text-ink-4">·</span>
                <span>
                  <span className="text-ink font-semibold">
                    {summary.distinct_keywords.toLocaleString("en-US")}
                  </span>{" "}
                  {lang === "vi" ? "truy vấn duy nhất" : "distinct queries"}
                </span>
                <span className="text-ink-4">·</span>
                <span>
                  <span className="text-ink font-semibold">
                    {summary.distinct_projects}
                  </span>{" "}
                  {lang === "vi" ? "dự án thương hiệu" : "brand projects"}
                </span>
                <span className="text-ink-4">·</span>
                <span>
                  <span className="text-ink font-semibold">
                    {summary.distinct_verticals}
                  </span>{" "}
                  {lang === "vi" ? "ngành" : "verticals"}
                </span>
                <span className="text-ink-4">·</span>
                <span>
                  <span className="text-ink font-semibold">459</span>{" "}
                  {lang === "vi" ? "lần SERP capture" : "SERP captures"}
                </span>
                <span className="text-ink-4">·</span>
                <span className="text-ink">
                  {summary.earliest?.slice(0, 10) ?? "—"} →{" "}
                  {summary.latest?.slice(0, 10) ?? "—"}
                </span>
              </div>
            </div>
          </header>

          {/* ── Key Takeaways ───────────────────────────────────── */}
          <KeyTakeaways
            eyebrow={lang === "vi" ? "tóm tắt nhanh" : "key takeaways"}
            title={
              lang === "vi"
                ? "Năm con số mô tả AIO Việt Nam tháng 4/2026"
                : "Five numbers that frame Vietnamese AIO in April 2026"
            }
            items={[
              {
                stat: (
                  <Num
                    value={(summary.aio_rows / summary.total_rows) * 100}
                    format="pct"
                    precision={0}
                  />
                ),
                text:
                  lang === "vi"
                    ? "tỷ lệ truy vấn thương mại Việt Nam có AI Overview, tính trên toàn bộ 244 nghìn truy vấn."
                    : "of Vietnamese commercial queries return an AI Overview, across 244K observations.",
              },
              {
                stat: f1Max ? (
                  <Num
                    value={Number(f1Max.aio_pct)}
                    format="pct"
                    precision={0}
                  />
                ) : (
                  "—"
                ),
                text:
                  lang === "vi"
                    ? "tỷ lệ truy vấn 10+ từ có AIO — đuôi dài đã bão hòa AIO."
                    : "of 10+ word queries return an AIO — the long tail is AIO-saturated.",
              },
              {
                stat: (
                  <Num
                    value={100 - getF2("pct_cited_in_top10") * 100}
                    format="pct"
                    precision={0}
                  />
                ),
                text:
                  lang === "vi"
                    ? "trích AIO đến từ ngoài top-10 organic. Xếp hạng SEO truyền thống chỉ là một phần của câu chuyện trích dẫn."
                    : "of AIO citations come from outside the organic top-10. Ranking on page one is only part of the citation story.",
              },
              {
                stat:
                  f5MaxRow && f5MinRow ? (
                    <Num
                      value={
                        Number(f5MaxRow.aio_pct) - Number(f5MinRow.aio_pct)
                      }
                      format="pp-delta"
                      precision={0}
                    />
                  ) : (
                    "—"
                  ),
                text:
                  lang === "vi"
                    ? "khoảng cách giữa ngành có AIO nhiều nhất và ít nhất. Một chiến lược GEO duy nhất không tồn tại."
                    : "spread between the most- and least-AIO-saturated verticals. There's no single GEO playbook.",
              },
              {
                stat: f1Max ? (
                  <Num
                    value={
                      Number(f1Max.aio_pct) /
                      Math.max(Number(f1Min?.aio_pct ?? 1), 1)
                    }
                    format="ratio"
                    precision={1}
                  />
                ) : (
                  "—"
                ),
                text:
                  lang === "vi"
                    ? "tỷ số AIO giữa truy vấn dài và truy vấn ngắn — AIO ưu tiên ngữ cảnh, không ưu tiên từ khóa hot."
                    : "ratio of AIO appearance on long vs short queries — AIO favors context, not high-volume keywords.",
              },
            ]}
            footnote={
              lang === "vi"
                ? "Mỗi con số là tóm tắt một phát hiện chi tiết bên dưới. Nhấn vào mục trong sidebar để đọc đầy đủ."
                : "Each headline summarizes a finding detailed below. Click an entry in the sidebar for the full breakdown."
            }
          />

          {/* ── Glossary ────────────────────────────────────────── */}
          <Glossary
            eyebrow={lang === "vi" ? "thuật ngữ" : "terminology"}
            title={
              lang === "vi"
                ? "Một số thuật ngữ dùng trong nghiên cứu này"
                : "Quick reference for terms used throughout"
            }
            items={[
              {
                term: lang === "vi" ? "AIO (AI Overview)" : "AIO (AI Overview)",
                definition:
                  lang === "vi"
                    ? "Câu trả lời do AI tạo, do Google hiển thị phía trên kết quả tìm kiếm organic, kèm trích dẫn các nguồn."
                    : "Google's AI-generated answer block shown above the organic results, with citations to source URLs.",
              },
              {
                term: lang === "vi" ? "Top-10 organic" : "Organic top-10",
                definition:
                  lang === "vi"
                    ? "10 kết quả organic đầu tiên trên SERP, không tính AIO, featured snippet, sitelinks, hay quảng cáo."
                    : "The first 10 organic results on the SERP, excluding AIO, featured snippets, sitelinks, and ads.",
              },
              {
                term: lang === "vi" ? "Trích dẫn (citation)" : "Citation",
                definition:
                  lang === "vi"
                    ? "Một URL được AIO liên kết trong câu trả lời như nguồn tham khảo. Một AIO có thể có nhiều trích dẫn."
                    : "A URL linked from an AIO answer as a reference source. A single AIO can carry several citations.",
              },
              {
                term:
                  lang === "vi"
                    ? "Mật độ trích dẫn"
                    : "Citation density",
                definition:
                  lang === "vi"
                    ? "Số lượt trích trung bình một domain nhận được, chia cho số truy vấn riêng biệt mà nó được trích — thước đo \"chất\" thay vì \"lượng\"."
                    : "A domain's total citations divided by the distinct queries it's cited on — a measure of citation quality, not volume.",
              },
              {
                term: lang === "vi" ? "Ngành (vertical)" : "Vertical",
                definition:
                  lang === "vi"
                    ? "Phân loại ngành của truy vấn hoặc dự án — ngân hàng, y tế, lifestyle, v.v."
                    : "The industry category of a query or project — banking, healthcare, lifestyle, etc.",
              },
              {
                term:
                  lang === "vi"
                    ? "GEO (Generative Engine Optimization)"
                    : "GEO (Generative Engine Optimization)",
                definition:
                  lang === "vi"
                    ? "Tối ưu để được trích dẫn trong câu trả lời AI (như AIO), khác với SEO — tối ưu để xếp hạng cao trong organic."
                    : "Optimization for being cited inside AI-generated answers like AIO — distinct from classical SEO, which targets organic ranking.",
              },
            ]}
          />

          {/* ── Section map — visual TOC ────────────────────────── */}
          <SectionMap
            eyebrow={lang === "vi" ? "cấu trúc nghiên cứu" : "what's inside"}
            title={
              lang === "vi"
                ? "Atlas này gồm tám phần: năm cụm phát hiện và ba phần đóng"
                : "The Atlas in eight parts: five clusters of findings, three closing sections"
            }
            countLabel={lang === "vi" ? "phát hiện" : "findings"}
            items={[
              {
                id: "section-i",
                number: "I",
                label: sectionLabels["section-i"],
                count: 1,
                description:
                  lang === "vi"
                    ? "AIO xuất hiện thường xuyên ra sao, và kích hoạt bởi loại truy vấn nào"
                    : "How often AIO appears, and what kind of query triggers one",
              },
              {
                id: "section-ii",
                number: "II",
                label: sectionLabels["section-ii"],
                count: 3,
                description:
                  lang === "vi"
                    ? "AIO trích dẫn ai, mật độ trích, và độ ổn định theo thời gian"
                    : "Who AIO cites, citation density, and stability over time",
              },
              {
                id: "section-iii",
                number: "III",
                label: sectionLabels["section-iii"],
                count: 4,
                description:
                  lang === "vi"
                    ? "Hành vi AIO thay đổi mạnh giữa các ngành — tỷ lệ, tập trung, trùng lặp"
                    : "AIO behavior splits hard by vertical — rate, concentration, overlap",
              },
              {
                id: "section-iv",
                number: "IV",
                label: sectionLabels["section-iv"],
                count: 4,
                description:
                  lang === "vi"
                    ? "Tín hiệu nào dự báo trích dẫn, và domain nào lãnh đạo xuyên ngành"
                    : "Which signals predict a citation, and which domains lead across verticals",
              },
              {
                id: "section-v",
                number: "V",
                label: sectionLabels["section-v"],
                count: 1,
                description:
                  lang === "vi"
                    ? "Thị phần trích dịch chuyển ở đâu trong cửa sổ 5 tháng"
                    : "Where citation share shifted in the 5-month window",
              },
              {
                id: "section-vi",
                number: "VI",
                label: sectionLabels["section-vi"],
                description:
                  lang === "vi"
                    ? "Cách thu thập dữ liệu, phát hiện AIO, và tính metric"
                    : "How the data was collected, AIO detected, and metrics computed",
              },
              {
                id: "section-vii",
                number: "VII",
                label: sectionLabels["section-vii"],
                description:
                  lang === "vi"
                    ? "Những điều nghiên cứu này không thể nói cho bạn"
                    : "What this study can't tell you",
              },
              {
                id: "section-viii",
                number: "VIII",
                label: sectionLabels["section-viii"],
                description:
                  lang === "vi"
                    ? "Bốn câu hỏi mở và bản đồ vòng theo dõi tiếp"
                    : "Four open questions and the next tracking cycle",
              },
            ]}
          />

          {/* ── Section I — Presence ────────────────────────────── */}
          <SectionDivider
            id="section-i"
            number="I"
            eyebrow={lang === "vi" ? "Phần I" : "Part I"}
            title={
              lang === "vi"
                ? "AIO xuất hiện ở đâu, và khi nào"
                : "Where AIO appears, and when"
            }
            intro={
              lang === "vi"
                ? "Bắt đầu bằng câu hỏi cơ bản nhất: trên 244 nghìn truy vấn thương mại Việt Nam, AIO xuất hiện thường xuyên đến mức nào? Và đặc điểm gì khiến một truy vấn có khả năng kích hoạt AIO?"
                : "Start with the most basic question: across 244K Vietnamese commercial queries, how often does Google show an AI Overview at all? And what makes a query likely to trigger one?"
            }
          />

          {/* ── F1 ──────────────────────────────────────────────── */}
          <FindingCard
            id="f1"
            eyebrow={tx(lang, "f1_eyebrow")}
            title={tx(lang, "f1_title")}
            takeaway={tx(lang, "f1_takeaway")}
            keyStat={
              f1Max
                ? {
                    value: <Num value={Number(f1Max.aio_pct)} format="pct" precision={1} />,
                    label:
                      lang === "vi"
                        ? `truy vấn 10+ từ có AIO (so với ${Number(f1Min?.aio_pct ?? 0).toFixed(1)}% truy vấn 1–2 từ)`
                        : `of 10+ word queries get an AIO (vs only ${Number(f1Min?.aio_pct ?? 0).toFixed(1)}% of 1–2 word queries)`,
                  }
                : undefined
            }
          >
            <ChartFigure
              eyebrow={lang === "vi" ? "Truy vấn theo độ dài" : "Query length"}
              title={
                lang === "vi"
                  ? "Tỷ lệ AIO tăng đều khi truy vấn dài hơn"
                  : "AIO presence rate climbs steadily with query length"
              }
              subtitle={
                lang === "vi"
                  ? `Tỷ lệ truy vấn có AIO theo từng nhóm độ dài (n=${summary.total_rows.toLocaleString()})`
                  : `AIO presence rate by query length bucket (n=${summary.total_rows.toLocaleString()})`
              }
              source={sourceLine}
            >
              <BarV
                data={f1Data.map((r) => ({
                  label: r.bucket,
                  value: Number(r.aio_pct),
                  highlight: r.bucket === "10+",
                }))}
                yLabel={tx(lang, "f1_y_label")}
                format="pct"
                height={320}
                annotations={[
                  {
                    forLabel: "10+",
                    text:
                      lang === "vi"
                        ? "truy vấn dài đã bão hòa AIO"
                        : "long-tail is AIO-saturated",
                    side: "above",
                    emphasis: true,
                  },
                ]}
              />
            </ChartFigure>
            <FindingAnalysis
              meaning={linkifyFindingRefs(findingMeaning("f1", lang))}
              methodNote={linkifyFindingRefs(findingMethod("f1", lang))}
              meaningLabel={meaningLabel}
              methodLabel={methodLabel}
            />
          </FindingCard>

          {/* ── Section II — Citation economics ────────────────── */}
          <SectionDivider
            id="section-ii"
            number="II"
            eyebrow={lang === "vi" ? "Phần II" : "Part II"}
            title={
              lang === "vi"
                ? "Kinh tế học của trích dẫn AIO"
                : "The economics of an AIO citation"
            }
            intro={
              lang === "vi"
                ? "Khi AIO trích nguồn, trích từ đâu? Kết quả: hơn nửa số trích đến từ ngoài top-10 organic. Top domain giành thị phần lớn không bằng lượng trang, mà bằng mật độ trích — và bức tranh này khá ổn định trong cả cửa sổ 5 tháng."
                : "When AIO does cite, where does it pull from? More than half of citations come from outside the organic top-10. Top domains dominate not by page count but by citation density — and the picture is remarkably stable across the 5-month window."
            }
          />

          {/* ── F2 ──────────────────────────────────────────────── */}
          <FindingCard
            id="f2"
            eyebrow={tx(lang, "f2_eyebrow")}
            title={tx(lang, "f2_title")}
            takeaway={tx(lang, "f2_takeaway")}
            keyStat={{
              value: (
                <Num
                  value={100 - getF2("pct_cited_in_top10") * 100}
                  format="pct"
                  precision={0}
                />
              ),
              label:
                lang === "vi"
                  ? "trích AIO đến từ ngoài top-10 organic"
                  : "of AIO citations come from outside organic top-10",
            }}
          >
            <ChartFigure
              eyebrow={
                lang === "vi"
                  ? "Trích trong vs ngoài top-10 organic"
                  : "Citations inside vs outside the organic top-10"
              }
              title={
                lang === "vi"
                  ? "Phần lớn URL được AIO trích đến từ ngoài top-10"
                  : "Most AIO-cited URLs come from outside the top-10"
              }
              subtitle={
                lang === "vi"
                  ? `Tỷ lệ ${getF2("rows_analyzed").toLocaleString()} trích AIO theo vị trí trên SERP organic`
                  : `Share of ${getF2("rows_analyzed").toLocaleString()} AIO citations by their position in organic SERP`
              }
              source={sourceLine}
            >
              <RatioBar
                left={{
                  value: getF2("pct_cited_in_top10") * 100,
                  label:
                    lang === "vi"
                      ? "trong top-10 organic"
                      : "inside organic top-10",
                  sub:
                    lang === "vi"
                      ? "URL AIO trích cũng nằm trong 10 kết quả organic đầu tiên"
                      : "AIO-cited URLs that also appear in the first 10 organic results",
                }}
                right={{
                  value: 100 - getF2("pct_cited_in_top10") * 100,
                  label:
                    lang === "vi"
                      ? "ngoài top-10 organic"
                      : "outside organic top-10",
                  sub:
                    lang === "vi"
                      ? "URL AIO trích nhưng không có trong top-10 organic — phần lớn nằm ở vị trí 11+ hoặc không xuất hiện trong organic"
                      : "AIO-cited URLs that don't appear in the organic top-10 — mostly position 11+ or absent from organic entirely",
                }}
              />
              <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-6 mt-10 pt-8 border-t border-line">
                <DataRow
                  label={tx(lang, "f2_rows_analyzed")}
                  value={getF2("rows_analyzed")}
                  format="count"
                />
                <DataRow
                  label={tx(lang, "f2_avg_cited")}
                  value={getF2("avg_cited")}
                  format="float"
                  precision={2}
                />
                <DataRow
                  label={tx(lang, "f2_avg_overlap")}
                  value={getF2("avg_overlap")}
                  format="float"
                  precision={2}
                />
              </dl>
            </ChartFigure>
            <FindingAnalysis
              meaning={linkifyFindingRefs(findingMeaning("f2", lang))}
              methodNote={linkifyFindingRefs(findingMethod("f2", lang))}
              meaningLabel={meaningLabel}
              methodLabel={methodLabel}
            />
          </FindingCard>

          {/* ── F3 ──────────────────────────────────────────────── */}
          <FindingCard
            id="f3"
            eyebrow={tx(lang, "f3_eyebrow")}
            title={tx(lang, "f3_title")}
            takeaway={tx(lang, "f3_takeaway")}
            keyStat={
              f3Data[0]
                ? {
                    value: (
                      <Num
                        value={Number(f3Data[0].citation_density)}
                        format="ratio"
                        precision={2}
                      />
                    ),
                    label: `${f3Data[0].domain} — ${
                      lang === "vi" ? "trích trung bình mỗi truy vấn" : "citations per distinct query"
                    }`,
                    sub:
                      lang === "vi"
                        ? "Facebook chỉ 1.87, YouTube 1.65"
                        : "Compare: Facebook 1.87, YouTube 1.65",
                  }
                : undefined
            }
          >
            <ChartFigure
              eyebrow={lang === "vi" ? "Top domain trích AIO" : "Top AIO-cited domains"}
              title={
                lang === "vi"
                  ? "Ngân hàng và y tế dẫn đầu thị phần trích nguồn AIO Việt Nam"
                  : "Banking and pharma dominate Vietnamese AIO citation share"
              }
              subtitle={
                lang === "vi"
                  ? "Top 20 domain theo tổng số lượt trích AIO"
                  : "Top 20 domains by total AIO citation count"
              }
              source={sourceLine}
            >
              <BarH
                data={f3Data.slice(0, 20).map((r, i) => ({
                  label: r.domain,
                  value: Number(r.citations),
                  highlight: i === 0,
                }))}
                xLabel={tx(lang, "f3_x_label")}
                format="num"
                rowHeight={26}
                labelWidth={180}
              />
            </ChartFigure>
            <FindingAnalysis
              meaning={linkifyFindingRefs(findingMeaning("f3", lang))}
              methodNote={linkifyFindingRefs(findingMethod("f3", lang))}
              meaningLabel={meaningLabel}
              methodLabel={methodLabel}
            />
          </FindingCard>

          {/* ── F4 ──────────────────────────────────────────────── */}
          <FindingCard
            id="f4"
            eyebrow={tx(lang, "f4_eyebrow")}
            title={tx(lang, "f4_title")}
            takeaway={tx(lang, "f4_takeaway")}
          >
            <ChartFigure
              eyebrow={lang === "vi" ? "Độ dài AIO theo tuần" : "AIO length, weekly"}
              title={
                lang === "vi"
                  ? "Độ dài câu trả lời AIO ổn định trong cửa sổ 5 tháng"
                  : "AI Overview answer length is stable over the 5-month window"
              }
              subtitle={
                lang === "vi"
                  ? "Độ dài AIO trung bình hàng tuần (avg, p50, p90 ký tự)"
                  : "Weekly AIO answer length (avg, p50, p90 characters)"
              }
              source={sourceLine}
            >
              <VisxLine
                data={f4Data.map((r) => ({
                  x: r.week.slice(0, 10),
                  avg: Number(r.avg_chars),
                  p50: Number(r.p50_chars),
                  p90: Number(r.p90_chars),
                }))}
                height={280}
                refLines={
                  f4Data.length > 0
                    ? [
                        {
                          value: Math.round(
                            f4Data.reduce(
                              (sum, r) => sum + Number(r.avg_chars),
                              0,
                            ) / f4Data.length,
                          ),
                          label:
                            lang === "vi"
                              ? "trung bình toàn cửa sổ"
                              : "5-month mean",
                        },
                      ]
                    : []
                }
              />
            </ChartFigure>
            <FindingAnalysis
              meaning={linkifyFindingRefs(findingMeaning("f4", lang))}
              methodNote={linkifyFindingRefs(findingMethod("f4", lang))}
              meaningLabel={meaningLabel}
              methodLabel={methodLabel}
            />
          </FindingCard>

          {/* ── Section III — The vertical view ─────────────────── */}
          <SectionDivider
            id="section-iii"
            number="III"
            eyebrow={lang === "vi" ? "Phần III" : "Part III"}
            title={
              lang === "vi"
                ? "Cách hành vi AIO thay đổi theo ngành"
                : "How AIO behavior splits by industry"
            }
            intro={
              lang === "vi"
                ? "Tỷ lệ AIO, mức độ tập trung trích, trùng lặp với top-10 — tất cả đều thay đổi mạnh theo ngành. Một chiến lược GEO áp dụng cho ngành thông tin sẽ thất bại trong ngành thương mại, và ngược lại. Bốn phát hiện sau cho thấy mức độ phân hóa."
                : "Presence rate, citation concentration, top-10 overlap — all of these split sharply by vertical. A GEO playbook that wins in informational categories fails in transactional ones, and vice versa. The next four findings quantify how far apart the verticals actually are."
            }
          />

          {/* ── F5 ──────────────────────────────────────────────── */}
          <FindingCard
            id="f5"
            eyebrow={tx(lang, "f5_eyebrow")}
            title={tx(lang, "f5_title")}
            takeaway={tx(lang, "f5_takeaway")}
            keyStat={
              f5MaxRow && f5MinRow
                ? {
                    value: (
                      <span>
                        <Num value={Number(f5MaxRow.aio_pct)} format="pct" precision={0} />{" "}
                        <span className="text-ink-3">→</span>{" "}
                        <Num value={Number(f5MinRow.aio_pct)} format="pct" precision={0} />
                      </span>
                    ),
                    label: `${f5MaxRow.vertical} → ${f5MinRow.vertical}`,
                    sub:
                      lang === "vi"
                        ? "khoảng cách ~50pp giữa ngành thông tin nhất và thương mại nhất"
                        : "~50pp gap between most-informational and most-transactional verticals",
                  }
                : undefined
            }
          >
            <ChartFigure
              eyebrow={lang === "vi" ? "Tỷ lệ AIO theo ngành" : "AIO presence by vertical"}
              title={
                lang === "vi"
                  ? "Ngành nặng thông tin bão hòa AIO; ngành thương mại thì không"
                  : "Information-heavy verticals are AIO-saturated; commercial verticals aren't"
              }
              subtitle={
                lang === "vi"
                  ? "Tỷ lệ truy vấn có AIO trong từng ngành khách hàng (≥1K dòng)"
                  : "AIO presence rate by client vertical (verticals with ≥1K rows)"
              }
              source={sourceLine}
            >
              <BarH
                data={f5Data.slice(0, 13).map((r, i, arr) => ({
                  label: r.vertical,
                  value: Number(r.aio_pct),
                  highlight: vertical
                    ? r.vertical === vertical
                    : i === 0 || i === arr.length - 1,
                }))}
                xLabel={tx(lang, "f5_x_label")}
                format="pct"
                rowHeight={28}
                labelWidth={140}
                annotations={(() => {
                  const slice = f5Data.slice(0, 13);
                  if (slice.length < 2) return [];
                  return [
                    {
                      forLabel: slice[0].vertical,
                      text:
                        lang === "vi"
                          ? "bão hòa AIO"
                          : "AIO-saturated",
                      emphasis: true,
                    },
                    {
                      forLabel: slice[slice.length - 1].vertical,
                      text:
                        lang === "vi"
                          ? "AIO hiếm khi xuất hiện"
                          : "AIO rarely appears",
                    },
                  ];
                })()}
              />
            </ChartFigure>
            <FindingAnalysis
              meaning={linkifyFindingRefs(findingMeaning("f5", lang))}
              methodNote={linkifyFindingRefs(findingMethod("f5", lang))}
              meaningLabel={meaningLabel}
              methodLabel={methodLabel}
            />
          </FindingCard>

          {/* ── F6 ──────────────────────────────────────────────── */}
          <FindingCard
            id="f6"
            eyebrow={tx(lang, "f6_eyebrow")}
            title={tx(lang, "f6_title")}
            takeaway={tx(lang, "f6_takeaway")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
              {Array.from(new Set(f6Data.map((r) => r.vertical)))
                .sort()
                .filter((v) => !vertical || v === vertical)
                .map((v) => {
                  const rows = f6Data
                    .filter((r) => r.vertical === v)
                    .slice(0, 5);
                  return (
                    <div key={v}>
                      <Eyebrow tone="accent" className="mb-3">
                        {v}
                      </Eyebrow>
                      <MiniBars
                        rows={rows.map((r) => ({
                          rank: r.rank_in_vertical,
                          label: r.domain,
                          value: Number(r.citations),
                        }))}
                        format="count"
                      />
                    </div>
                  );
                })}
            </div>
            <FindingAnalysis
              meaning={linkifyFindingRefs(findingMeaning("f6", lang))}
              methodNote={linkifyFindingRefs(findingMethod("f6", lang))}
              meaningLabel={meaningLabel}
              methodLabel={methodLabel}
            />
          </FindingCard>

          {/* ── F7 ──────────────────────────────────────────────── */}
          <FindingCard
            id="f7"
            eyebrow={tx(lang, "f7_eyebrow")}
            title={tx(lang, "f7_title")}
            takeaway={tx(lang, "f7_takeaway")}
            keyStat={
              f7Max && f7Min
                ? {
                    value: (
                      <span>
                        <Num value={Number(f7Max.top10_share)} format="pct" precision={0} />{" "}
                        <span className="text-ink-3">→</span>{" "}
                        <Num value={Number(f7Min.top10_share)} format="pct" precision={0} />
                      </span>
                    ),
                    label: `${f7Max.vertical} → ${f7Min.vertical}`,
                    sub:
                      lang === "vi"
                        ? "khoảng cách giữa thị trường tập trung nhất và phân mảnh nhất"
                        : "spread between most-concentrated and most-fragmented markets",
                  }
                : undefined
            }
          >
            <ChartFigure
              eyebrow={lang === "vi" ? "Top-10 chiếm thị phần trích" : "Top-10 share of citations"}
              title={
                lang === "vi"
                  ? "Tập trung trích nguồn dao động từ winner-take-all đến đuôi dài"
                  : "Citation concentration ranges from winner-take-all to long-tail"
              }
              subtitle={
                lang === "vi"
                  ? "% lượt trích AIO trong ngành đi đến top 10 domain"
                  : "% of AIO citations within each vertical going to its top 10 domains"
              }
              source={sourceLine}
            >
              <BarH
                data={f7Data.map((r, i, arr) => ({
                  label: r.vertical,
                  value: Number(r.top10_share),
                  highlight: vertical
                    ? r.vertical === vertical
                    : i === 0 || i === arr.length - 1,
                  sub: r.top1_domain ?? undefined,
                }))}
                xLabel={tx(lang, "f7_x_label")}
                format="pct"
                rowHeight={32}
                labelWidth={140}
                annotations={
                  f7Data.length >= 2
                    ? [
                        {
                          forLabel: f7Data[0].vertical,
                          text:
                            lang === "vi"
                              ? "top-10 chiếm gần như toàn bộ"
                              : "winner-take-all",
                          emphasis: true,
                        },
                        {
                          forLabel: f7Data[f7Data.length - 1].vertical,
                          text:
                            lang === "vi"
                              ? "thị trường phân mảnh"
                              : "long-tail market",
                        },
                      ]
                    : []
                }
              />
            </ChartFigure>
            <FindingAnalysis
              meaning={linkifyFindingRefs(findingMeaning("f7", lang))}
              methodNote={linkifyFindingRefs(findingMethod("f7", lang))}
              meaningLabel={meaningLabel}
              methodLabel={methodLabel}
            />
          </FindingCard>

          {/* ── F8 ──────────────────────────────────────────────── */}
          <FindingCard
            id="f8"
            eyebrow={tx(lang, "f8_eyebrow")}
            title={tx(lang, "f8_title")}
            takeaway={tx(lang, "f8_takeaway")}
            keyStat={
              f8Min
                ? {
                    value: (
                      <Num
                        value={Number(f8Min.pct_cited_in_top10) * 100}
                        format="pct"
                        precision={0}
                      />
                    ),
                    label:
                      lang === "vi"
                        ? `${f8Min.vertical}: AIO trích từ ngoài top-10 nhiều nhất`
                        : `${f8Min.vertical}: where AIO reaches outside top-10 the most`,
                  }
                : undefined
            }
          >
            <ChartFigure
              eyebrow={lang === "vi" ? "Trùng lặp AIO ↔ top-10" : "AIO ↔ top-10 overlap"}
              title={
                lang === "vi"
                  ? "Ở thị trường đuôi dài, xếp hạng organic là chưa đủ"
                  : "In long-tail verticals, ranking organically isn't enough"
              }
              subtitle={
                lang === "vi"
                  ? "% trích AIO cũng nằm trong top-10 organic theo ngành"
                  : "% of AIO citations that also appear in organic top-10, by vertical"
              }
              source={sourceLine}
            >
              <BarH
                data={f8Data.map((r) => ({
                  label: r.vertical,
                  value: Number(r.pct_cited_in_top10) * 100,
                  highlight: vertical
                    ? r.vertical === vertical
                    : r.vertical === f8Min?.vertical,
                }))}
                xLabel={tx(lang, "f8_x_label")}
                format="pct"
                rowHeight={28}
                labelWidth={140}
                annotations={
                  f8Min
                    ? [
                        {
                          forLabel: f8Min.vertical,
                          text:
                            lang === "vi"
                              ? "AIO trích nhiều từ ngoài top-10"
                              : "AIO cites outside top-10 here",
                          emphasis: true,
                        },
                      ]
                    : []
                }
              />
            </ChartFigure>
            <FindingAnalysis
              meaning={linkifyFindingRefs(findingMeaning("f8", lang))}
              methodNote={linkifyFindingRefs(findingMethod("f8", lang))}
              meaningLabel={meaningLabel}
              methodLabel={methodLabel}
            />
          </FindingCard>

          {/* ── Section IV — Signals ────────────────────────────── */}
          <SectionDivider
            id="section-iv"
            number="IV"
            eyebrow={lang === "vi" ? "Phần IV" : "Part IV"}
            title={
              lang === "vi"
                ? "Tín hiệu nào dự báo trích dẫn"
                : "Which signals predict a citation"
            }
            intro={
              lang === "vi"
                ? "Sitelinks, rating, price, độ dài tiêu đề — tín hiệu nào tương quan với khả năng được AIO trích? Câu trả lời không đồng đều theo ngành: tín hiệu mạnh nhất cho ngân hàng có thể vô nghĩa cho lifestyle. Phần này cũng nhìn vào AIO trông giống gì khi nó xuất hiện, và domain nào lãnh đạo trích dẫn ở nhiều ngành cùng lúc."
                : "Sitelinks, ratings, price markup, title length — which signals correlate with being cited by AIO? The answer isn't uniform across verticals: the strongest signal in banking can be meaningless in lifestyle. This section also looks at what an AIO answer actually looks like when it appears, and which domains lead citations across more than one vertical at the same time."
            }
          />

          {/* ── F9 ──────────────────────────────────────────────── */}
          <FindingCard
            id="f9"
            eyebrow={tx(lang, "f9_eyebrow")}
            title={tx(lang, "f9_title")}
            takeaway={tx(lang, "f9_takeaway")}
            keyStat={
              f9Sitelinks
                ? {
                    value: (
                      <Num
                        value={Number(f9Sitelinks.relative_diff_pct) / 100 + 1}
                        format="ratio"
                        precision={1}
                      />
                    ),
                    label:
                      lang === "vi"
                        ? "URL có sitelinks được trích nhiều hơn URL không có"
                        : "more often cited: URLs with sitelinks vs URLs without",
                  }
                : undefined
            }
          >
            <div className="space-y-1">
              {f9Data.map((r) => {
                const cited = Number(r.cited_value);
                const uncited = Number(r.uncited_value);
                const max = Math.max(cited, uncited, 1);
                const isPct = r.feature.startsWith("pct_");
                return (
                  <div
                    key={r.feature}
                    className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-2.5 border-b border-line"
                  >
                    <div className="text-[14px] font-medium text-ink">
                      {r.feature.replace(/^pct_|^avg_/, "").replace(/_/g, " ")}
                    </div>
                    <div className="w-48 sm:w-72 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className="eyebrow text-ink-3 w-16">
                          {tx(lang, "f9_label_cited")}
                        </div>
                        <div className="flex-1 h-2 bg-card-2 overflow-hidden">
                          <div
                            className="h-full bg-accent"
                            style={{ width: `${(cited / max) * 100}%` }}
                          />
                        </div>
                        <span className="font-mono-num text-[11px] text-ink-2 w-14 text-right">
                          {isPct ? `${cited.toFixed(1)}%` : cited.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="eyebrow text-ink-4 w-16">
                          {tx(lang, "f9_label_uncited")}
                        </div>
                        <div className="flex-1 h-2 bg-card-2 overflow-hidden">
                          <div
                            className="h-full bg-line-strong"
                            style={{ width: `${(uncited / max) * 100}%` }}
                          />
                        </div>
                        <span className="font-mono-num text-[11px] text-ink-3 w-14 text-right">
                          {isPct ? `${uncited.toFixed(1)}%` : uncited.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`font-mono-num text-[12px] font-bold w-16 text-right ${
                        r.relative_diff_pct === null
                          ? "text-ink-4"
                          : Number(r.relative_diff_pct) > 0
                            ? "text-accent"
                            : "text-negative"
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
            <FindingAnalysis
              meaning={linkifyFindingRefs(findingMeaning("f9", lang))}
              methodNote={linkifyFindingRefs(findingMethod("f9", lang))}
              meaningLabel={meaningLabel}
              methodLabel={methodLabel}
            />
          </FindingCard>

          {/* ── F10 ─────────────────────────────────────────────── */}
          <FindingCard
            id="f10"
            eyebrow={tx(lang, "f10_eyebrow")}
            title={tx(lang, "f10_title")}
            takeaway={tx(lang, "f10_takeaway")}
            keyStat={
              f10Healthcare && f10Jewelry
                ? {
                    value: (
                      <Num
                        value={f10Healthcare.avg_md_chars / f10Jewelry.avg_md_chars}
                        format="ratio"
                        precision={2}
                      />
                    ),
                    label:
                      lang === "vi"
                        ? `câu trả lời y tế dài hơn trang sức (${f10Healthcare.avg_md_chars.toLocaleString()} so với ${f10Jewelry.avg_md_chars.toLocaleString()} ký tự)`
                        : `healthcare AIOs vs jewelry AIOs (${f10Healthcare.avg_md_chars.toLocaleString()} vs ${f10Jewelry.avg_md_chars.toLocaleString()} chars)`,
                  }
                : undefined
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <ChartFigure
                eyebrow={lang === "vi" ? "Độ dài AIO" : "AIO answer length"}
                title={
                  lang === "vi"
                    ? "Y tế có câu trả lời AIO dài nhất"
                    : "Healthcare AIOs are longest"
                }
                subtitle={
                  lang === "vi"
                    ? "Số ký tự trung bình theo ngành"
                    : "Average characters per AIO answer, by vertical"
                }
              >
                <BarH
                  data={f10Data.map((r, i) => ({
                    label: r.vertical,
                    value: Number(r.avg_md_chars),
                    highlight: vertical
                      ? r.vertical === vertical
                      : i === 0,
                  }))}
                  format="num"
                  rowHeight={26}
                  labelWidth={120}
                />
              </ChartFigure>
              <ChartFigure
                eyebrow={lang === "vi" ? "Số trích nguồn" : "Citations per AIO"}
                title={
                  lang === "vi"
                    ? "Y tế cũng trích nhiều nguồn nhất"
                    : "Healthcare cites the most sources too"
                }
                subtitle={
                  lang === "vi"
                    ? "Số trích trung bình mỗi câu trả lời AIO"
                    : "Average references per AIO answer, by vertical"
                }
              >
                <BarH
                  data={f10Data.map((r, i) => ({
                    label: r.vertical,
                    value: Number(r.avg_refs_per_aio),
                    highlight: vertical
                      ? r.vertical === vertical
                      : i === 0,
                  }))}
                  format="raw"
                  rowHeight={26}
                  labelWidth={120}
                />
              </ChartFigure>
            </div>
            <FindingAnalysis
              meaning={linkifyFindingRefs(findingMeaning("f10", lang))}
              methodNote={linkifyFindingRefs(findingMethod("f10", lang))}
              meaningLabel={meaningLabel}
              methodLabel={methodLabel}
            />
          </FindingCard>

          {/* ── F11 ─────────────────────────────────────────────── */}
          <FindingCard
            id="f11"
            eyebrow={tx(lang, "f11_eyebrow")}
            title={tx(lang, "f11_title")}
            takeaway={tx(lang, "f11_takeaway")}
            keyStat={
              f11Banking
                ? {
                    value: (
                      <Num
                        value={Number(f11Banking.relative_diff_pct)}
                        format="pct"
                        precision={0}
                      />
                    ),
                    label:
                      lang === "vi"
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
                    : r.feature === "avg_rank_absolute" || r.feature === "pct_has_price"
                      ? -Number(r.relative_diff_pct)
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
            <p className="text-[12px] text-ink-3 mt-4 leading-relaxed">
              {tx(lang, "f11_caption")}
            </p>
            <FindingAnalysis
              meaning={linkifyFindingRefs(findingMeaning("f11", lang))}
              methodNote={linkifyFindingRefs(findingMethod("f11", lang))}
              meaningLabel={meaningLabel}
              methodLabel={methodLabel}
            />
          </FindingCard>

          {/* ── F13 — derived from F6 data ──────────────────────── */}
          <FindingCard
            id="f13"
            eyebrow={lang === "vi" ? "phát hiện 13" : "finding 13"}
            title={
              lang === "vi"
                ? "Lãnh đạo trích AIO xuyên ngành rất hiếm — và phần lớn là nền tảng chung"
                : "Cross-vertical AIO citation leadership is rare — and mostly belongs to platforms"
            }
            takeaway={
              lang === "vi"
                ? "Trong toàn bộ corpus, chỉ một số ít domain xuất hiện trong top-5 trích dẫn của hơn một ngành. Hầu hết các domain top là chuyên gia ngành — uy tín ở ngành mà họ tập trung, không phải xuyên các thị trường."
                : "Across the entire corpus, only a handful of domains appear in the top-5 cited list of more than one vertical. Most top domains are vertical specialists — authoritative within the category they focus on, not across markets."
            }
            keyStat={
              f13Top
                ? {
                    value: (
                      <Num
                        value={f13Top.reach}
                        format="raw"
                      />
                    ),
                    label:
                      lang === "vi"
                        ? `${f13Top.domain} — số ngành mà domain này xuất hiện trong top-5 trích dẫn`
                        : `${f13Top.domain} — verticals where this domain appears in the top-5 cited`,
                    sub:
                      lang === "vi"
                        ? `${f13Data.length} domain có mặt trong top-5 của ít nhất một ngành`
                        : `${f13Data.length} domains in the top-5 of at least one vertical`,
                  }
                : undefined
            }
          >
            <ChartFigure
              eyebrow={
                lang === "vi" ? "Phạm vi xuyên ngành" : "Cross-vertical reach"
              }
              title={
                lang === "vi"
                  ? "Số ngành mà domain xuất hiện trong top-5 trích AIO"
                  : "Verticals each domain appears in among the top-5 AIO-cited"
              }
              subtitle={
                lang === "vi"
                  ? `Top ${f13Data.length} domain theo phạm vi (rank ≤ 5 trong từng ngành)`
                  : `Top ${f13Data.length} domains by reach (rank ≤ 5 within each vertical)`
              }
              source={sourceLine}
            >
              <BarH
                data={f13Data.map((r, i) => ({
                  label: r.domain,
                  value: r.reach,
                  highlight: i === 0,
                  sub:
                    r.verticals.length > 1
                      ? r.verticals.slice(0, 3).join(", ") +
                        (r.verticals.length > 3
                          ? ` +${r.verticals.length - 3}`
                          : "")
                      : r.verticals[0],
                }))}
                xLabel={lang === "vi" ? "số ngành" : "verticals reached"}
                format="raw"
                rowHeight={32}
                labelWidth={170}
              />
            </ChartFigure>
            <FindingAnalysis
              meaning={linkifyFindingRefs(findingMeaning("f13", lang))}
              methodNote={linkifyFindingRefs(findingMethod("f13", lang))}
              meaningLabel={meaningLabel}
              methodLabel={methodLabel}
            />
          </FindingCard>

          {/* ── Section V — Movement over time ──────────────────── */}
          <SectionDivider
            id="section-v"
            number="V"
            eyebrow={lang === "vi" ? "Phần V" : "Part V"}
            title={
              lang === "vi"
                ? "Cuộc đua thị phần đang diễn ra ở đâu"
                : "Where the share race is actually moving"
            }
            intro={
              lang === "vi"
                ? "Phần lớn cấu trúc trích AIO khá tĩnh trong 5 tháng — nhưng không phải tất cả. Phần cuối nhìn vào thay đổi theo tháng để tìm ra nơi thị phần đang dịch chuyển: ai đang giành lên, ai đang mất xuống, và bao xa."
                : "Most of the AIO citation structure is remarkably static over the 5-month window — but not all of it. This final section steps through month-by-month shifts in domain share to find where the marketshare race is moving: who's gaining, who's losing, and by how much."
            }
          />

          {/* ── F12 ─────────────────────────────────────────────── */}
          <FindingCard
            id="f12"
            eyebrow={tx(lang, "f12_eyebrow")}
            title={tx(lang, "f12_title")}
            takeaway={tx(lang, "f12_takeaway")}
            keyStat={{
              value: (
                <span>
                  <span className="text-negative">−</span>
                  <Num value={2.8} format="float" precision={1} />
                  pp
                </span>
              ),
              label:
                lang === "vi"
                  ? "Techcombank: thị phần trích AIO ngân hàng tháng 4/2026 vs tháng 12/2025"
                  : "Techcombank: April vs December banking AIO share",
              sub:
                lang === "vi"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
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
                        <Eyebrow tone="accent" className="mb-3">
                          {v}
                        </Eyebrow>
                        <div className="space-y-px">
                          {domainEntries.map((d) => (
                            <div
                              key={d.domain}
                              className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center text-[14px] border-b border-line py-2"
                            >
                              <span className="font-medium text-ink truncate pr-2">
                                {d.domain}
                              </span>
                              <Sparkline values={d.points.map((p) => p.share)} />
                              <span className="font-mono-num text-[12px] text-ink-2 w-14 text-right">
                                <Num value={d.last} format="pct" precision={1} />
                              </span>
                              <span
                                className={`font-mono-num text-[11px] font-bold w-14 text-right ${
                                  d.delta > 0.3
                                    ? "text-positive"
                                    : d.delta < -0.3
                                      ? "text-negative"
                                      : "text-ink-4"
                                }`}
                              >
                                <Num value={d.delta} format="pp-delta" />
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
            <p className="text-[12px] text-ink-3 mt-4 leading-relaxed">
              {tx(lang, "f12_caption")}
            </p>
            <FindingAnalysis
              meaning={linkifyFindingRefs(findingMeaning("f12", lang))}
              methodNote={linkifyFindingRefs(findingMethod("f12", lang))}
              meaningLabel={meaningLabel}
              methodLabel={methodLabel}
            />
          </FindingCard>

          {/* ── Section VI — Methodology ──────────────────────── */}
          <SectionDivider
            id="section-vi"
            number="VI"
            eyebrow={lang === "vi" ? "Phần VI" : "Part VI"}
            title={
              lang === "vi"
                ? "Cách nghiên cứu này được thực hiện"
                : "How this study was actually built"
            }
            intro={
              lang === "vi"
                ? "Nghiên cứu phụ thuộc nhiều vào lựa chọn — mẫu nào, đo cái gì, lọc thế nào. Phần này nói rõ những lựa chọn để bạn có thể đánh giá kết quả với đúng mức tin cậy, và tái tạo lại bằng pipeline của riêng bạn nếu muốn."
                : "Research lives or dies on choices — what to sample, what to measure, what to exclude. This section makes those choices explicit so you can weight the findings with the right confidence, and so you could rebuild the corpus from your own pipeline if you wanted to."
            }
          />
          <StudyClosing>
            <ClosingBlock
              eyebrow={lang === "vi" ? "nguồn dữ liệu" : "data source"}
              title={
                lang === "vi"
                  ? "264 dự án thương hiệu Việt Nam, theo dõi định kỳ trong 5 tháng"
                  : "264 Vietnamese brand projects, tracked at regular cadence over 5 months"
              }
            >
              <p>
                {lang === "vi"
                  ? "Dữ liệu nền là pipeline tracking SERP nội bộ của SEONGON. Cứ ~3 ngày, hệ thống lấy snapshot các kết quả Google cho danh sách truy vấn của từng dự án khách hàng. Mỗi snapshot ghi lại trang SERP đầy đủ: AIO (nếu có), featured snippet, top-10 organic, sitelinks, ads, knowledge panel."
                  : "The underlying dataset is SEONGON's internal SERP-tracking pipeline. Roughly every three days, the system snapshots Google results for each client project's tracked-query list. Every snapshot captures the full SERP frame: AIO (if present), featured snippet, organic top-10, sitelinks, ads, knowledge panel."}
              </p>
              <p>
                {lang === "vi" ? (
                  <>
                    Cửa sổ nghiên cứu là{" "}
                    <strong>2 tháng 12, 2025 → 24 tháng 4, 2026</strong> ({summary.distinct_projects} dự án thương hiệu, {summary.distinct_keywords.toLocaleString()} truy vấn riêng biệt, {summary.total_rows.toLocaleString()} dòng quan sát, {summary.total_citations.toLocaleString()} trích dẫn AIO). Mỗi dòng là một quan sát (truy vấn × dự án × snapshot). Cùng một truy vấn quan sát ở 50 thời điểm khác nhau sẽ tạo 50 dòng — điều này phản ánh đúng nhịp thay đổi của AIO theo thời gian.
                  </>
                ) : (
                  <>
                    The study window is{" "}
                    <strong>December 2, 2025 → April 24, 2026</strong> ({summary.distinct_projects} brand projects, {summary.distinct_keywords.toLocaleString()} distinct queries, {summary.total_rows.toLocaleString()} observation rows, {summary.total_citations.toLocaleString()} AIO citations). Each row is one observation: (query × project × snapshot). The same query observed at 50 different snapshots produces 50 rows — that's intentional, because AIO behavior shifts week-over-week.
                  </>
                )}
              </p>
              <p>
                {lang === "vi"
                  ? "Phân loại ngành (vertical) được gán ở mức dự án từ siêu dữ liệu nội bộ của SEONGON, không phải gán theo từng truy vấn. Một dự án ngân hàng có 100 truy vấn về sản phẩm, hỗ trợ, brand, v.v. — tất cả đều thuộc \"banking\" trong phân tích này. Cách tiếp cận đó hy sinh độ tinh nhất ở mức truy vấn để đổi lấy mức độ tin cậy thống kê ở cấp ngành."
                  : "Vertical labels are assigned at the project level from SEONGON's internal metadata, not at the query level. A banking project carries 100 queries spanning product, support, brand, and so on — all of which sit under \"banking\" in this analysis. The trade-off: per-query granularity is sacrificed for statistical stability at the vertical level."}
              </p>
            </ClosingBlock>

            <ClosingBlock
              eyebrow={lang === "vi" ? "phát hiện AIO" : "AIO detection"}
              title={
                lang === "vi"
                  ? "AIO được phát hiện qua selector + phân tích markdown"
                  : "AIO is detected via DOM selectors plus markdown parsing"
              }
            >
              <p>
                {lang === "vi"
                  ? "AIO được nhận diện bằng selectors HTML cho khối câu trả lời \"AI Overview\" của Google. Khi phát hiện, thân nội dung được trích ra và chuyển sang markdown — số ký tự thân được tính từ markdown này, không tính text URL của các trích dẫn. Vùng \"Show more\" được mở trước khi trích để dữ liệu thân không bị cắt cụt."
                  : "AIO is identified using HTML selectors for Google's \"AI Overview\" answer block. When detected, the body content is extracted and converted to markdown — body character counts are computed from this markdown, excluding the rendered text of cited URL anchors. The \"Show more\" expansion is opened before extraction so the body data isn't truncated."}
              </p>
              <p>
                {lang === "vi"
                  ? "Trích dẫn AIO là tập URL được liên kết trong câu trả lời. Một AIO có thể mang nhiều trích — pipeline trích đầy đủ và chuẩn hóa domain (kéo về eTLD+1, ví dụ techcombank.com.vn). Tất cả thống kê \"top cited domains\" và \"share-of-voice\" đều dùng tập đã chuẩn hóa này."
                  : "AIO citations are the set of URLs linked from the answer body. A single AIO can carry several — the pipeline extracts all of them and normalizes to eTLD+1 (e.g. techcombank.com.vn). All \"top cited domains\" and \"share-of-voice\" statistics use the normalized set."}
              </p>
              <p>
                {lang === "vi"
                  ? "Top-10 organic được xác định loại trừ AIO, featured snippets, sitelinks, image carousels, video carousels, knowledge panels, và quảng cáo. Việc loại trừ là chủ đích: \"top-10 thực\" cần là 10 vị trí organic đầu tiên mà người làm SEO truyền thống cạnh tranh — không phải 10 vị trí đầu của trang được tính theo mọi loại block."
                  : "The organic top-10 is computed by excluding AIO, featured snippets, sitelinks, image carousels, video carousels, knowledge panels, and ads. The exclusion is intentional: a \"true top-10\" should be the first 10 organic slots an SEO practitioner is competing for — not the first 10 of the page including every block type."}
              </p>
            </ClosingBlock>

            <ClosingBlock
              eyebrow={lang === "vi" ? "thống kê" : "statistics"}
              title={
                lang === "vi"
                  ? "Phép đo, ngưỡng lọc, và lý do chọn"
                  : "Metric definitions, filter thresholds, and the reasoning behind them"
              }
            >
              <p>
                {lang === "vi"
                  ? "Mỗi phát hiện dùng một metric đơn — định nghĩa trong \"ghi chú phương pháp\" của phát hiện đó. Hầu hết là tỷ lệ (%), ratio, hoặc trung bình. Không có model xác suất nào được fit; không có phép suy diễn trên tập dân số ngoài (không generalize ra ngoài 264 dự án). Hệ quả: kết quả mạnh trong corpus này, nhưng không được hiểu là khẳng định toàn cầu về \"AIO Việt Nam\"."
                  : "Each finding uses a single metric — defined in the finding's \"method note.\" Most are percentages, ratios, or means. No probabilistic model is fit; no inference is attempted onto an outside population (these results don't generalize beyond the 264 projects). The implication: the findings are strong within this corpus, but should not be read as universal claims about \"Vietnamese AIO.\""}
              </p>
              <p>
                {linkifyFindingRefs(
                  lang === "vi"
                    ? "Lọc tối thiểu (≥1K dòng cho ngành ở F5, ≥30 truy vấn riêng biệt cho domain ở F3) được áp dụng để các phát hiện không bị chi phối bởi trường hợp ngoại lệ với mẫu nhỏ. Các ngưỡng được chọn để cân bằng giữa độ tin cậy và độ bao phủ — đặt cao hơn sẽ làm các ngành nhỏ biến mất; đặt thấp hơn sẽ làm các trường hợp 1-truy-vấn xuất hiện trong bảng xếp hạng."
                    : "Minimum filters (≥1K rows per vertical in F5, ≥30 distinct queries per domain in F3) are applied so the findings aren't dominated by small-sample edge cases. The thresholds are chosen to balance confidence with coverage — higher thresholds make small verticals disappear; lower thresholds let one-query specialists appear in leaderboards.",
                )}
              </p>
              <p>
                {linkifyFindingRefs(
                  lang === "vi"
                    ? "Mọi metric được tính trên cùng cửa sổ nghiên cứu để có thể so sánh giữa các phát hiện. Khi một phát hiện hiển thị xu hướng theo thời gian (F4, F12), điều đó được nói rõ trong tiêu đề và phương pháp."
                    : "All metrics are computed over the same study window to allow cross-finding comparison. When a finding does show a time trend (F4, F12), that's stated explicitly in the title and method note.",
                )}
              </p>
            </ClosingBlock>
          </StudyClosing>

          {/* ── Section VII — Limitations ─────────────────────── */}
          <SectionDivider
            id="section-vii"
            number="VII"
            eyebrow={lang === "vi" ? "Phần VII" : "Part VII"}
            title={
              lang === "vi"
                ? "Những gì nghiên cứu này không thể nói cho bạn"
                : "What this study can't tell you"
            }
            intro={
              lang === "vi"
                ? "Mẫu nghiên cứu là 264 dự án thương mại Việt Nam — bộ giới hạn cụ thể với rủi ro thiên lệch cụ thể. Phần này nêu rõ ranh giới của những gì có thể kết luận, để bạn không kéo các kết quả ra ngoài phạm vi mà chúng thực sự hỗ trợ."
                : "The sample is 264 Vietnamese commercial projects — a specific frame with specific biases. This section names the boundaries of what can be concluded, so you don't pull these findings outside the range they actually support."
            }
          />
          <StudyClosing>
            <ClosingBlock
              eyebrow={lang === "vi" ? "phạm vi mẫu" : "sample scope"}
              title={
                lang === "vi"
                  ? "Đây là tìm kiếm thương mại Việt Nam, không phải toàn bộ tìm kiếm"
                  : "This is Vietnamese commercial search, not search in general"
              }
            >
              <p>
                {lang === "vi"
                  ? "264 dự án trong corpus đều là khách hàng SEONGON — phần lớn là doanh nghiệp đang đầu tư SEO/marketing. Nghĩa là tập truy vấn đã thiên về (a) ngành mà SEONGON phục vụ (ngân hàng, y tế, lifestyle, jewelry, ô tô, v.v.), và (b) loại truy vấn có giá trị thương mại cao đủ để khách hàng tracking. Truy vấn thuần thông tin (ai là tác giả, tóm tắt sách, công thức nấu ăn) gần như vắng mặt."
                  : "The 264 projects are all SEONGON clients — companies actively investing in SEO/marketing. That biases the query set toward (a) the industries SEONGON serves (banking, healthcare, lifestyle, jewelry, automotive, etc.) and (b) commercially valuable queries that justify tracking. Purely informational queries (who-wrote-what, book summaries, recipes) are largely absent."}
              </p>
              <p>
                {lang === "vi"
                  ? "Kết quả ổn định trong cuộc khảo sát này không kết luận được hành vi AIO tổng thể trên Google Search Việt Nam, không nói được gì về thị trường khác (Indonesia, Philippines), và không nói được gì về truy vấn có ý định khác (giáo dục, nghiên cứu, lập trình)."
                  : "Findings here say nothing about AIO behavior on Google Search Vietnam as a whole, nothing about other markets (Indonesia, Philippines), and nothing about queries with non-commercial intent (education, research, programming)."}
              </p>
            </ClosingBlock>

            <ClosingBlock
              eyebrow={lang === "vi" ? "thời gian" : "time window"}
              title={
                lang === "vi"
                  ? "5 tháng là một khoảnh khắc, không phải một xu hướng"
                  : "Five months is a moment, not a trend"
              }
            >
              <p>
                {lang === "vi"
                  ? "Cửa sổ 12/2025 → 4/2026 đặt corpus vào một giai đoạn cụ thể của AIO Việt Nam — sau khi Google đã ra mắt rộng AIO ở thị trường VN, nhưng vẫn còn trong giai đoạn đầu của \"trưởng thành\". Hầu hết các phát hiện ở đây có thể không đúng vào tháng 4/2025 (khi AIO còn mới ở VN) và có thể không đúng vào tháng 4/2027 (khi AIO có thể đã nâng cấp đáng kể)."
                  : "The December 2025 → April 2026 window puts the corpus in a specific phase of Vietnamese AIO — after Google rolled AIO out broadly in VN, but still in early-maturity. Most findings here likely weren't true in April 2025 (when AIO was new in VN) and may not hold in April 2027 (when AIO will have shipped meaningful upgrades)."}
              </p>
              <p>
                {linkifyFindingRefs(
                  lang === "vi"
                    ? "Sự ổn định nhìn thấy trong F4 (độ dài) và F12 (thị phần) chỉ là sự ổn định trong cửa sổ này. Coi nó như xác nhận rằng AIO không đang lặp tích cực trong giai đoạn này — không phải xác nhận rằng AIO sẽ tĩnh mãi mãi."
                    : "The stability observed in F4 (length) and F12 (share) is stability within this window only. Treat it as evidence that AIO isn't actively iterating during this phase — not as evidence that AIO will be static permanently.",
                )}
              </p>
            </ClosingBlock>

            <ClosingBlock
              eyebrow={lang === "vi" ? "nhân quả" : "causality"}
              title={
                lang === "vi"
                  ? "Mọi điều ở đây là tương quan, không phải nhân quả"
                  : "Everything here is correlation, not causation"
              }
            >
              <p>
                {linkifyFindingRefs(
                  lang === "vi"
                    ? "Khi F9 cho thấy URL có sitelinks được trích nhiều hơn, điều đó KHÔNG nói rằng \"thêm sitelinks vào URL của bạn để được trích nhiều hơn\". Cả hai đặc trưng (có sitelinks, được AIO trích) có khả năng do cùng một nguyên nhân nền — uy tín domain. Cố gắng tối ưu một mặt mà bỏ qua nguyên nhân nền là lỗi tư duy phổ biến."
                    : "When F9 shows that URLs with sitelinks are cited more often, it does NOT say \"add sitelinks to your URL to get cited more often.\" Both features (having sitelinks, being cited by AIO) are likely caused by the same underlying factor — domain authority. Optimizing for the surface feature while ignoring the underlying cause is a common reasoning failure.",
                )}
              </p>
              <p>
                {linkifyFindingRefs(
                  lang === "vi"
                    ? "Cùng nguyên tắc áp dụng cho mọi phát hiện ở mức tín hiệu (F9, F11): các phát hiện này nên đọc như chỉ hướng đến \"loại tín hiệu uy tín nào AIO nhạy cảm\" — không phải danh sách checklist của thứ cần làm."
                    : "The same caveat applies to every signal-level finding (F9, F11): these should be read as directional pointers toward what kind of authority signal AIO is sensitive to — not as a checklist of things to install.",
                )}
              </p>
            </ClosingBlock>
          </StudyClosing>

          {/* ── Section VIII — What we still don't know ─────────── */}
          <SectionDivider
            id="section-viii"
            number="VIII"
            eyebrow={lang === "vi" ? "Phần VIII" : "Part VIII"}
            title={
              lang === "vi"
                ? "Kết: những gì còn cần làm rõ"
                : "Closing: what still needs to be answered"
            }
            intro={
              lang === "vi"
                ? "Atlas chuyển kỳ vọng sang phương hướng — nó không khép kín câu hỏi. Một vài câu hỏi vẫn mở, và việc theo dõi tiếp giai đoạn 2026-2027 sẽ trả lời chúng."
                : "The Atlas advances expectations into directions — it doesn't close the question. A few questions remain open, and continued tracking through 2026-2027 should answer them."
            }
          />
          <StudyClosing>
            <ClosingBlock
              eyebrow={lang === "vi" ? "câu hỏi mở" : "open questions"}
              title={
                lang === "vi"
                  ? "Bốn điều chúng tôi sẽ trả lời trong vòng theo dõi tiếp theo"
                  : "Four things the next tracking cycle should answer"
              }
            >
              <p>
                <strong>
                  {lang === "vi"
                    ? "1. AIO presence có tiệm cận trần không?"
                    : "1. Does AIO presence asymptote?"}
                </strong>{" "}
                {lang === "vi"
                  ? "Tỷ lệ truy vấn có AIO đã tăng đến ~65% tổng quát và ~80% đuôi dài. Câu hỏi: nó dừng lại ở đâu? Trên 80%? 90%? Truy vấn nào AIO chủ động không xuất hiện và tại sao?"
                  : "AIO appearance rate has climbed to ~65% overall and ~80% on the long tail. Where does it stop? Above 80%? 90%? On what queries does AIO actively decline to appear, and why?"}
              </p>
              <p>
                <strong>
                  {lang === "vi"
                    ? "2. Cấu trúc trích dẫn có rời rạc với cấu trúc xếp hạng không?"
                    : "2. Is the citation structure becoming uncorrelated with ranking structure?"}
                </strong>{" "}
                {linkifyFindingRefs(
                  lang === "vi"
                    ? "F2 cho biết hiện tại có ~60% trích đến từ ngoài top-10. Nếu con số này tăng theo thời gian, AIO đang phát triển hệ thống xếp hạng riêng. Nếu nó giảm, AIO đang hội tụ về Google ranking. Cả hai đều có hệ quả lớn cho GEO."
                    : "F2 reports that ~60% of citations come from outside the organic top-10 today. If this number rises over time, AIO is developing its own ranking system. If it falls, AIO is converging back toward Google ranking. Either direction has large GEO implications.",
                )}
              </p>
              <p>
                <strong>
                  {lang === "vi"
                    ? "3. Tín hiệu nào thật sự dự báo trích, ở mức nguyên nhân?"
                    : "3. Which signals truly predict citation, at the causal level?"}
                </strong>{" "}
                {linkifyFindingRefs(
                  lang === "vi"
                    ? "F9 và F11 chỉ ra tương quan; chúng không phân biệt được tín hiệu thật sự đến \"AIO score\" với những thứ chỉ cùng-nguyên-nhân với uy tín domain. Một thí nghiệm có chủ đích — thêm sitelinks/rating trên một mẫu URL kiểm soát và quan sát — sẽ tách được hai loại tín hiệu này."
                    : "F9 and F11 surface correlations; they don't separate signals that truly inform \"AIO score\" from signals that merely co-vary with domain authority. A deliberate experiment — adding sitelinks/rating on a controlled subset of URLs and watching — would separate the two.",
                )}
              </p>
              <p>
                <strong>
                  {lang === "vi"
                    ? "4. Lifecycle của thị phần AIO ngành ngắn hay dài?"
                    : "4. How long is the lifecycle of an AIO citation share?"}
                </strong>{" "}
                {linkifyFindingRefs(
                  lang === "vi"
                    ? "F12 cho thấy thị phần dao động ít qua 5 tháng. Liệu thị phần năm 2027 có giống năm 2026? Nếu có, GEO là một game incumbent kéo dài. Nếu không, mọi 18 tháng có thể là đủ để cấu trúc trích viết lại."
                    : "F12 shows share moves slowly over 5 months. Will share in 2027 still resemble share in 2026? If yes, GEO is a long incumbent game. If not, every 18 months might be enough for the citation structure to reshape.",
                )}
              </p>
            </ClosingBlock>

            <ClosingBlock
              eyebrow={lang === "vi" ? "vòng tiếp theo" : "what comes next"}
              title={
                lang === "vi"
                  ? "Atlas sẽ tiếp tục cập nhật"
                  : "The Atlas will keep updating"
              }
            >
              <p>
                {lang === "vi"
                  ? "Pipeline tracking SERP của SEONGON tiếp tục chạy. Atlas này được dự kiến cập nhật lần tiếp theo trong Q3 2026 với corpus mở rộng và một số phát hiện thử nghiệm mới (F13+: AIO answer factuality, citation-position bias trong AIO, intent-class breakdown). Kế hoạch tham vọng hơn — chia sẻ corpus dạng mở khả dụng cho nghiên cứu — đang được cân nhắc, phụ thuộc các vấn đề về quyền và tách biệt khách hàng."
                  : "SEONGON's SERP-tracking pipeline continues to run. The Atlas is currently scheduled for its next update in Q3 2026 with an expanded corpus and several new experimental findings (F13+: AIO answer factuality, citation-position bias inside AIOs, intent-class breakdowns). A more ambitious plan — making a sharable corpus available for outside research — is being weighed, pending privacy and client-isolation work."}
              </p>
              <p>
                {lang === "vi"
                  ? "Phản hồi và yêu cầu phân tích cụ thể đều được hoan nghênh — gửi qua email được liệt kê trong phần tác giả, hoặc qua issue trên GitHub repository."
                  : "Feedback and specific analysis requests are welcome — by email at the address listed in the researcher block, or as an issue on the GitHub repository."}
              </p>
            </ClosingBlock>
          </StudyClosing>

          <AtlasFooter
            lang={lang}
            buildDate={summary.latest?.slice(0, 10) ?? "—"}
            windowStart={summary.earliest?.slice(0, 10) ?? "—"}
            windowEnd={summary.latest?.slice(0, 10) ?? "—"}
          />
        </div>
      </main>
    </div>
  );
}
