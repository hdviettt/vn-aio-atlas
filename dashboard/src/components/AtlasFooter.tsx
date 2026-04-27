import type { Lang } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CiteButton } from "@/components/CiteButton";

/**
 * AtlasFooter — close-out of the Atlas. With Methodology / Limitations
 * / Closing now living in the main column as Sections VI–VIII, the
 * footer is intentionally lean: researcher bio + citation + license +
 * a small row of supporting links. Editorial finality, not an
 * encyclopedia.
 */
export function AtlasFooter({
  lang,
  buildDate,
  windowStart,
  windowEnd,
}: {
  lang: Lang;
  buildDate: string;
  windowStart: string;
  windowEnd: string;
}) {
  return (
    <footer className="mt-24 pt-16 border-t border-line-strong">
      {/* ── Researcher + citation ──────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 md:gap-16 mb-16">
        <div>
          <Eyebrow tone="accent" className="mb-3">
            {lang === "vi" ? "tác giả" : "researcher"}
          </Eyebrow>
          <h3 className="font-display-tight text-[22px] md:text-[24px] font-semibold text-ink mb-4">
            <a
              href="https://hoangducviet.work"
              className="text-ink hover:text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hoang Duc Viet
            </a>
          </h3>
          <p className="text-[15px] text-ink-2 leading-relaxed mb-3 max-w-2xl">
            {lang === "vi"
              ? "Trưởng phòng Nghiên cứu & Phát triển tại "
              : "Head of R&D at "}
            <a
              href="https://seongon.com"
              className="text-accent hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              SEONGON
            </a>
            {lang === "vi"
              ? ". Nghiên cứu hành vi tìm kiếm AI và GEO (Generative Engine Optimization) trên thị trường Việt Nam. Atlas là sáng kiến nghiên cứu công khai dài hạn của SEONGON, ra mắt tháng 4/2026."
              : ". Researches AI search behavior and GEO (Generative Engine Optimization) on the Vietnamese market. The Atlas is a long-running public-research initiative of SEONGON, first published April 2026."}
          </p>
          <p className="text-[13px] text-ink-3">
            {lang === "vi" ? "Liên hệ: " : "Contact: "}
            <a
              href="mailto:agentic@seongon.com"
              className="text-accent hover:underline"
            >
              agentic@seongon.com
            </a>
          </p>
        </div>
        <div>
          <Eyebrow tone="muted" className="mb-3">
            {lang === "vi" ? "trích dẫn nghiên cứu này" : "cite this study"}
          </Eyebrow>
          <p className="text-[13px] text-ink-2 leading-relaxed mb-3">
            {lang === "vi"
              ? "Một bản trích dẫn đã định dạng (CSL/APA-style) sẽ được sao vào clipboard."
              : "A formatted citation (CSL/APA-style) will be copied to your clipboard."}
          </p>
          <CiteButton lang={lang} />
        </div>
      </section>

      {/* ── Supporting links + license + build info ────────────── */}
      <section className="pt-10 border-t border-line">
        <Eyebrow tone="muted" className="mb-4">
          {lang === "vi" ? "tài nguyên" : "resources"}
        </Eyebrow>
        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-10">
          <a
            href="https://github.com/hdviettt/vn-aio-atlas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-accent hover:underline"
          >
            → GitHub repository
          </a>
          <a
            href="https://github.com/hdviettt/vn-aio-atlas/blob/main/FINDINGS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-accent hover:underline"
          >
            {lang === "vi"
              ? "→ Tài liệu kết quả (machine-readable)"
              : "→ Findings doc (machine-readable)"}
          </a>
          <a
            href={
              lang === "vi"
                ? "https://github.com/hdviettt/vn-aio-atlas/blob/main/report/REPORT_vi.md"
                : "https://github.com/hdviettt/vn-aio-atlas/blob/main/report/REPORT.md"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-accent hover:underline"
          >
            {lang === "vi"
              ? "→ Báo cáo markdown (in-print)"
              : "→ Markdown report (print-friendly)"}
          </a>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-ink-3 leading-relaxed mb-3">
          <span>
            {lang === "vi" ? "Giấy phép" : "License"}: CC BY 4.0
          </span>
          <span>
            {lang === "vi" ? "Cập nhật" : "Updated"}: {buildDate}
          </span>
          <span>
            {lang === "vi" ? "Cửa sổ dữ liệu" : "Data window"}:{" "}
            {windowStart} → {windowEnd}
          </span>
          <span>v0.6</span>
        </div>
        <p className="text-[12px] text-ink-3 leading-relaxed max-w-3xl">
          {lang === "vi"
            ? "Bạn có thể chia sẻ và áp dụng kết quả nghiên cứu này nếu trích dẫn nguồn rõ ràng. Mã nguồn dashboard được phát hành mã nguồn mở dưới giấy phép MIT."
            : "You're free to share and adapt these findings with attribution. The dashboard source is open under the MIT license."}
        </p>
      </section>
    </footer>
  );
}
