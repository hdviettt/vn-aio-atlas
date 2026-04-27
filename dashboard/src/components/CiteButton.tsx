"use client";

import { useState } from "react";

export function CiteButton({ lang = "en" }: { lang?: "en" | "vi" }) {
  const [copied, setCopied] = useState(false);

  const year = new Date().getFullYear();
  const citation =
    lang === "vi"
      ? `Hoàng Đức Việt (${year}). Atlas AI Overview Việt Nam: Nghiên cứu thực nghiệm hành vi AI Overview của Google trên thị trường tìm kiếm thương mại Việt Nam, tháng 12/2025 – tháng 4/2026. SEONGON. https://vn-aio-atlas-dashboard-production.up.railway.app`
      : `Hoang, D. V. (${year}). Vietnam AI Overview Atlas: An empirical study of Google AI Overview behavior on Vietnamese commercial search, December 2025–April 2026. SEONGON. https://vn-aio-atlas-dashboard-production.up.railway.app`;

  async function copyCitation() {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard might not be available; fall back to selection
      const ta = document.createElement("textarea");
      ta.value = citation;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={copyCitation}
      className="text-xs text-slate-500 hover:text-indigo-700 transition-colors text-left w-full"
      title={citation}
    >
      {copied
        ? lang === "vi"
          ? "✓ Đã sao chép trích dẫn"
          : "✓ Citation copied"
        : lang === "vi"
          ? "📋 Trích dẫn nghiên cứu này"
          : "📋 Cite this study"}
    </button>
  );
}
