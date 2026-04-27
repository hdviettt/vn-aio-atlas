import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * FindingCard — every finding section. Standardized order:
 *   eyebrow → title → optional keyStat → takeaway → chart/data
 *
 * The keyStat block uses the design's biggest typographic move:
 * a 56-64px tabular number in accent, with descriptive label below.
 * Reserved for findings with a clear headline number; null findings
 * (F4) and pure-grid findings (F2, F6) skip it.
 *
 * keyStat.value accepts ReactNode so callers can pass either a raw
 * <Number> component or formatted strings like "83% → 34%". Numbers
 * are tabular by default via the parent's font-num class.
 */
export function FindingCard({
  id,
  eyebrow,
  title,
  takeaway,
  keyStat,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  takeaway?: string;
  keyStat?: {
    value: ReactNode;
    label?: string;
    sub?: string;
  };
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-8 py-16 md:py-20 border-t border-line first:border-t-0 first:pt-6"
    >
      <Eyebrow tone="accent" className="mb-3">
        {eyebrow}
      </Eyebrow>
      <h2 className="font-display-tight text-[28px] md:text-[36px] font-bold text-ink leading-[1.15] mb-6 max-w-3xl">
        {title}
      </h2>

      {keyStat && (
        <div className="my-8 max-w-2xl">
          <div className="font-num text-[56px] md:text-[64px] font-bold text-accent leading-none mb-3 tracking-[-0.02em]">
            {keyStat.value}
          </div>
          {keyStat.label && (
            <div className="text-[16px] md:text-[17px] text-ink-2 leading-snug max-w-xl">
              {keyStat.label}
            </div>
          )}
          {keyStat.sub && (
            <div className="mt-1 text-[13px] text-ink-3">{keyStat.sub}</div>
          )}
        </div>
      )}

      {takeaway && (
        <p className="text-[16px] md:text-[17px] text-ink-2 leading-relaxed mb-12 max-w-3xl">
          {takeaway}
        </p>
      )}

      <div className="mt-2 max-w-4xl">{children}</div>
    </section>
  );
}
