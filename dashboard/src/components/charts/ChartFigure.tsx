import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * ChartFigure — every chart's parent. Encodes the publication pattern
 * from NYT Upshot / Pew Research / Our World in Data:
 *
 *   eyebrow         → category tag (small caps, accent or muted)
 *   title           → states the FINDING, not the variable
 *   subtitle        → variable + unit + N
 *   chart           → the figure itself
 *   source          → "Source: ..." line (small, muted)
 *
 * Use as a wrapper around any visx chart:
 *
 *   <ChartFigure
 *     eyebrow="Long-tail queries"
 *     title="AI Overviews appear 2.5× more often on long-tail queries"
 *     subtitle="AIO presence rate, by query length (n=231,365)"
 *     source="Source: SEONGON SERP-tracking pipeline · Dec 2025–Apr 2026"
 *   >
 *     <BarV data={...} />
 *   </ChartFigure>
 */
export function ChartFigure({
  eyebrow,
  title,
  subtitle,
  source,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  source?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={`space-y-2 ${className}`}>
      {(eyebrow || title || subtitle) && (
        <header className="space-y-1 mb-3">
          {eyebrow && <Eyebrow tone="muted">{eyebrow}</Eyebrow>}
          {title && (
            <h3 className="text-[16px] font-semibold leading-snug text-ink max-w-2xl">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[13px] text-ink-2 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </header>
      )}
      <div className="mt-2">{children}</div>
      {source && (
        <figcaption className="text-[11px] text-ink-3 mt-3 leading-relaxed">
          {source}
        </figcaption>
      )}
    </figure>
  );
}
