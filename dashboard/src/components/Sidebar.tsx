"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { Lang } from "@/lib/i18n";
import { CiteButton } from "@/components/CiteButton";
import { Select } from "@/components/ui/Select";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";

export type FindingNavItem = {
  id: string;
  label: string;
  number: string;
};

export function Sidebar({
  findings,
  verticals,
  vertical,
  lang,
  labels,
}: {
  findings: FindingNavItem[];
  verticals: string[];
  vertical?: string;
  lang: Lang;
  labels: { all: string; viewing: string; languageLabel: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    findings.forEach((f) => {
      const el = document.getElementById(f.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [findings]);

  const goWith = (next: URLSearchParams) => {
    router.push(
      `${pathname}${next.toString() ? `?${next.toString()}` : ""}`,
      { scroll: false },
    );
  };

  const updateVertical = (v: string) => {
    const next = new URLSearchParams(params.toString());
    if (v === "all") next.delete("vertical");
    else next.set("vertical", v);
    goWith(next);
    setMobileOpen(false);
  };

  const updateLang = (l: Lang) => {
    const next = new URLSearchParams(params.toString());
    if (l === "en") next.delete("lang");
    else next.set("lang", l);
    goWith(next);
  };

  const verticalOptions = [
    { value: "all", label: labels.all },
    ...verticals.map((v) => ({ value: v, label: v })),
  ];

  const navContent = (
    <>
      {/* Brand */}
      <div className="px-6 py-7 border-b border-zinc-200">
        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-600 mb-1">
          atlas
        </div>
        <a
          href={lang === "en" ? "/" : "/?lang=vi"}
          className="block font-display text-xl font-bold tracking-tight text-zinc-900 leading-tight hover:text-indigo-700 transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          {lang === "vi" ? "AI Overview Việt Nam" : "Vietnam AI Overview"}
        </a>
      </div>

      {/* Controls */}
      <div className="px-6 py-5 border-b border-zinc-200 space-y-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 mb-1.5">
            {vertical ? labels.viewing : labels.all}
          </div>
          <Select
            value={vertical ?? "all"}
            options={verticalOptions}
            onChange={updateVertical}
            ariaLabel={labels.all}
          />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 mb-1.5">
            {labels.languageLabel}
          </div>
          <SegmentedToggle<Lang>
            value={lang}
            options={[
              { value: "en", label: "EN" },
              { value: "vi", label: "VI" },
            ]}
            onChange={updateLang}
            ariaLabel={labels.languageLabel}
          />
        </div>
      </div>

      {/* Findings nav */}
      <nav className="px-2 py-4 flex-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 mb-2 px-4">
          {lang === "vi" ? "phát hiện" : "findings"}
        </div>
        <ul className="space-y-0.5">
          {findings.map((f) => (
            <li key={f.id}>
              <a
                href={`#${f.id}`}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-1.5 text-xs leading-snug border-l-2 transition-colors ${
                  activeId === f.id
                    ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold"
                    : "border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <span className="tabular-nums text-zinc-400 mr-2 font-mono text-[10px]">
                  {f.number.padStart(2, "0")}
                </span>
                {f.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* External links + citation */}
      <div className="px-6 py-4 border-t border-zinc-200 space-y-2">
        <a
          href={
            lang === "vi"
              ? "https://github.com/hdviettt/vn-aio-atlas/blob/main/report/REPORT_vi.md"
              : "https://github.com/hdviettt/vn-aio-atlas/blob/main/report/REPORT.md"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-zinc-600 hover:text-indigo-700 transition-colors"
        >
          {lang === "vi" ? "→ Báo cáo đầy đủ" : "→ Full report"}
        </a>
        <a
          href="https://github.com/hdviettt/vn-aio-atlas/blob/main/FINDINGS.md"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-zinc-600 hover:text-indigo-700 transition-colors"
        >
          {lang === "vi" ? "→ Tài liệu kết quả" : "→ Findings doc"}
        </a>
        <a
          href="https://github.com/hdviettt/vn-aio-atlas"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-zinc-600 hover:text-indigo-700 transition-colors"
        >
          → GitHub
        </a>
        <div className="pt-2 border-t border-zinc-100 mt-2">
          <CiteButton lang={lang} />
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-30 bg-white border border-zinc-300 px-3 py-2 text-sm font-medium shadow-sm"
        aria-expanded={mobileOpen}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-zinc-900/40 z-30"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-[260px] bg-white border-r border-zinc-200 flex flex-col transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
