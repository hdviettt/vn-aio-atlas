"use client";

import { useState } from "react";
import { Quote, Check } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

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
      className="inline-flex items-center gap-1.5 text-[12px] text-ink-2 hover:text-accent w-full text-left"
      title={citation}
    >
      <Icon name={copied ? Check : Quote} size={14} className={copied ? "text-positive" : ""} />
      <span>
        {copied
          ? lang === "vi"
            ? "Đã sao chép trích dẫn"
            : "Citation copied"
          : lang === "vi"
            ? "Trích dẫn nghiên cứu này"
            : "Cite this study"}
      </span>
    </button>
  );
}
