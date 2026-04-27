import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * KeyTakeaways — elevator-pitch summary block placed between hero and
 * findings. Editorial treatment: no boxes, single hairline top, lots
 * of whitespace, oversize editorial heading. Stat numbers are big
 * and accent-colored so the eye reads them first.
 */
export function KeyTakeaways({
  eyebrow,
  title,
  items,
  footnote,
}: {
  eyebrow: string;
  title: string;
  items: { stat: ReactNode; text: string }[];
  footnote?: string;
}) {
  return (
    <section className="my-24 md:my-28 pt-12 border-t border-line-strong">
      <Eyebrow tone="accent" className="mb-4">
        {eyebrow}
      </Eyebrow>
      <h2 className="font-display-tight text-[28px] md:text-[36px] font-bold text-ink leading-[1.15] mb-12 max-w-3xl">
        {title}
      </h2>
      <ol className="space-y-10 md:space-y-12 max-w-3xl">
        {items.map((it, i) => (
          <li
            key={i}
            className="grid grid-cols-[3.5rem_1fr] md:grid-cols-[5.5rem_1fr] gap-6 md:gap-8 items-baseline"
          >
            <span className="font-mono-num text-[11px] text-ink-4 pt-2">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-3 md:gap-8 items-baseline">
              <span
                className="font-num text-[36px] md:text-[44px] font-bold text-accent leading-none tracking-[-0.025em] tabular-nums"
                aria-hidden="true"
              >
                {it.stat}
              </span>
              <p className="text-[16px] md:text-[17px] text-ink-2 leading-relaxed">
                {it.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
      {footnote && (
        <p className="text-[12px] text-ink-3 mt-12 leading-relaxed max-w-2xl">
          {footnote}
        </p>
      )}
    </section>
  );
}
