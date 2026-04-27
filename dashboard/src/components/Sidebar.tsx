"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import type { Lang } from "@/lib/i18n";
import { CiteButton } from "@/components/CiteButton";
import { Monogram } from "@/components/Monogram";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Select } from "@/components/ui/Select";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";

/**
 * SidebarItem — discriminated union so the sidebar nav matches the
 * page's actual hierarchy: roman-numeral sections (clickable to that
 * section's anchor) plus their nested findings.
 *
 * Section heads can either group findings beneath them (kind="section",
 * with no findings nested under VI–VIII) or stand alone as standalone
 * scrollable anchors (the closing sections).
 */
export type SidebarFinding = {
  kind: "finding";
  id: string;
  number: string;
  label: string;
};

export type SidebarSection = {
  kind: "section";
  id: string; // anchor to scroll to
  number: string; // "I", "II", ...
  label: string; // section label
};

export type SidebarItem = SidebarSection | SidebarFinding;

export function Sidebar({
  items,
  verticals,
  vertical,
  lang,
  labels,
}: {
  items: SidebarItem[];
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
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

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
      <div className="px-6 py-7 border-b border-line">
        <div className="flex items-center gap-3">
          <a
            href={lang === "en" ? "/" : "/?lang=vi"}
            className="text-accent hover:text-[var(--color-accent-hover)]"
            onClick={() => setMobileOpen(false)}
            aria-label="Atlas home"
          >
            <Monogram size={28} />
          </a>
          <div className="min-w-0">
            <div className="eyebrow text-accent mb-0.5">atlas</div>
            <a
              href={lang === "en" ? "/" : "/?lang=vi"}
              className="block text-[15px] font-semibold tracking-tight text-ink leading-tight hover:text-accent truncate"
              onClick={() => setMobileOpen(false)}
            >
              {lang === "vi" ? "AI Overview Việt Nam" : "Vietnam AI Overview"}
            </a>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-5 border-b border-line space-y-4">
        <div>
          <Eyebrow tone="muted" className="mb-1.5">
            {vertical ? labels.viewing : labels.all}
          </Eyebrow>
          <Select
            value={vertical ?? "all"}
            options={verticalOptions}
            onChange={updateVertical}
            ariaLabel={labels.all}
          />
        </div>
        <div>
          <Eyebrow tone="muted" className="mb-1.5">
            {labels.languageLabel}
          </Eyebrow>
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

      {/* TOC — sections + nested findings */}
      <nav className="px-2 py-4 flex-1 overflow-y-auto relative">
        <Eyebrow tone="muted" className="mb-3 px-4">
          {lang === "vi" ? "mục lục" : "contents"}
        </Eyebrow>
        <ul className="space-y-px">
          {items.map((item) => {
            const active = activeId === item.id;
            if (item.kind === "section") {
              return (
                <li key={item.id} className="pt-3 first:pt-0">
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
                      active
                        ? "text-accent"
                        : "text-ink-3 hover:text-ink"
                    }`}
                  >
                    <span
                      className={`font-mono-num text-[10px] mr-2 ${
                        active ? "text-accent" : "text-ink-4"
                      }`}
                    >
                      {item.number}
                    </span>
                    {item.label}
                  </a>
                </li>
              );
            }
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={`block pl-9 pr-4 py-1.5 text-[13px] leading-snug transition-colors ${
                    active
                      ? "text-accent font-semibold"
                      : "text-ink-2 hover:text-ink"
                  }`}
                >
                  <span
                    className={`font-mono-num text-[10px] mr-2 ${
                      active ? "text-accent" : "text-ink-4"
                    }`}
                  >
                    {item.number.padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        {/* Bottom scroll fade */}
        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 h-8"
          style={{
            background:
              "linear-gradient(to top, var(--color-card), transparent)",
          }}
          aria-hidden="true"
        />
      </nav>

      {/* External links + citation */}
      <div className="px-6 py-4 border-t border-line space-y-2">
        <a
          href="https://github.com/hdviettt/vn-aio-atlas"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-[12px] text-ink-2 hover:text-accent"
        >
          → GitHub
        </a>
        <div className="pt-2 border-t border-line mt-2">
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
        className="md:hidden fixed top-4 left-4 z-30 bg-card border border-line h-9 w-9 inline-flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
        aria-expanded={mobileOpen}
        aria-label="Toggle navigation"
      >
        <Icon name={mobileOpen ? X : Menu} size={16} />
      </button>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-ink/40 z-30 animate-fade-in-up"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-[260px] bg-card border-r border-line flex flex-col transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}

/* Re-export for backward-compatible types in page.tsx callers. */
export type FindingNavItem = SidebarFinding;
