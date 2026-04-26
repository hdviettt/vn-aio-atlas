"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { Lang } from "@/lib/i18n";

export function StickyHeader({
  verticals,
  vertical,
  lang,
  labels,
}: {
  verticals: string[];
  vertical?: string;
  lang: Lang;
  labels: { all: string; viewing: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

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
  };

  const updateLang = (l: Lang) => {
    const next = new URLSearchParams(params.toString());
    if (l === "en") next.delete("lang");
    else next.set("lang", l);
    goWith(next);
  };

  return (
    <div className="sticky top-0 z-20 -mx-6 mb-10 px-6 py-3 bg-white/85 backdrop-blur-sm border-b border-slate-200">
      <div className="flex items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">
            {vertical ? labels.viewing : labels.all}
          </span>
          <select
            value={vertical ?? "all"}
            onChange={(e) => updateVertical(e.target.value)}
            className="border border-slate-300 px-2 py-1 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">{labels.all}</option>
            {verticals.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => updateLang("en")}
            className={`px-2 py-1 ${
              lang === "en"
                ? "text-indigo-700 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
            aria-pressed={lang === "en"}
          >
            EN
          </button>
          <span className="text-slate-300">/</span>
          <button
            type="button"
            onClick={() => updateLang("vi")}
            className={`px-2 py-1 ${
              lang === "vi"
                ? "text-indigo-700 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
            aria-pressed={lang === "vi"}
          >
            VI
          </button>
        </div>
      </div>
    </div>
  );
}
