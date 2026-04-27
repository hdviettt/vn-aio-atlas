import type { ReactNode } from "react";

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
    value: string;
    label?: string;
    sub?: string;
  };
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-8 py-16 md:py-24 border-t border-zinc-200 first:border-t-0 first:pt-6"
    >
      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600 mb-3">
        {eyebrow}
      </div>
      <h2 className="font-display text-3xl md:text-[2.5rem] font-bold tracking-tight text-zinc-900 mb-6 leading-[1.1] max-w-3xl">
        {title}
      </h2>

      {keyStat && (
        <div className="my-8 max-w-2xl">
          <div className="font-numbers text-[3.5rem] md:text-[4.5rem] font-bold text-indigo-700 leading-none mb-3">
            {keyStat.value}
          </div>
          {keyStat.label && (
            <div className="text-base md:text-lg text-zinc-700 leading-snug max-w-xl">
              {keyStat.label}
            </div>
          )}
          {keyStat.sub && (
            <div className="mt-1 text-sm text-zinc-500">{keyStat.sub}</div>
          )}
        </div>
      )}

      {takeaway && (
        <p className="text-base md:text-lg text-zinc-600 leading-relaxed mb-12 max-w-3xl">
          {takeaway}
        </p>
      )}

      <div className="mt-2 max-w-4xl">{children}</div>
    </section>
  );
}

/**
 * Stat is intentionally compact — display fonts are only on titles, NOT
 * on numbers. Numbers belong in sans with tabular-nums so they read as
 * data, not as ornament.
 */
export function Stat({
  label,
  value,
  sub,
  size = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  size?: "default" | "large" | "small";
}) {
  const numClasses = {
    large: "text-[2rem] md:text-[2.5rem]",
    default: "text-2xl md:text-3xl",
    small: "text-lg md:text-xl",
  };
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 mb-1.5">
        {label}
      </div>
      <div
        className={`font-numbers ${numClasses[size]} font-semibold text-zinc-900 leading-none truncate`}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-zinc-500 mt-1.5">{sub}</div>}
    </div>
  );
}
