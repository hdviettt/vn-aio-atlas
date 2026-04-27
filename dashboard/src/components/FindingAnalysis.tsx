import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * FindingAnalysis — the "what this means" + "method note" extension
 * that makes the Atlas a self-contained study, not a digest pointing
 * to an external report. Sits inside a FindingCard, after the chart.
 *
 * Editorial treatment: hairline top, eyebrow + body, then optional
 * method note in smaller mute type beneath. No box, no fill — type
 * + whitespace + a single rule do all the work.
 */
export function FindingAnalysis({
  meaning,
  methodNote,
  meaningLabel,
  methodLabel,
}: {
  meaning: ReactNode;
  methodNote?: ReactNode;
  meaningLabel?: string;
  methodLabel?: string;
}) {
  return (
    <div className="mt-12 pt-8 border-t border-line max-w-3xl">
      <Eyebrow tone="accent" className="mb-3">
        {meaningLabel ?? "what this means"}
      </Eyebrow>
      <div className="text-[15px] md:text-[16px] text-ink-2 leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0">
        {typeof meaning === "string" ? <p>{meaning}</p> : meaning}
      </div>
      {methodNote && (
        <div className="mt-6 pt-5 border-t border-line">
          <Eyebrow tone="muted" className="mb-2">
            {methodLabel ?? "method note"}
          </Eyebrow>
          <div className="text-[13px] text-ink-3 leading-relaxed max-w-2xl">
            {typeof methodNote === "string" ? <p>{methodNote}</p> : methodNote}
          </div>
        </div>
      )}
    </div>
  );
}
