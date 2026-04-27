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
      className="scroll-mt-8 py-14 md:py-20 border-t border-slate-200 first:border-t-0 first:pt-6"
    >
      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600 mb-2">
        {eyebrow}
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
        {title}
      </h2>

      {keyStat && (
        <div className="my-7 inline-flex flex-col border-l-4 border-indigo-600 pl-5 py-1">
          <div className="font-display text-5xl md:text-6xl font-bold tracking-tight text-indigo-700 leading-none">
            {keyStat.value}
          </div>
          {keyStat.label && (
            <div className="mt-2 text-sm font-medium text-slate-700">
              {keyStat.label}
            </div>
          )}
          {keyStat.sub && (
            <div className="mt-0.5 text-xs text-slate-500">{keyStat.sub}</div>
          )}
        </div>
      )}

      {takeaway && (
        <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-10 max-w-3xl">
          {takeaway}
        </p>
      )}

      <div className="mt-2">{children}</div>
    </section>
  );
}

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
  const sizeClasses = {
    large: "text-4xl md:text-5xl",
    default: "text-2xl md:text-3xl",
    small: "text-lg md:text-xl",
  };
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-1.5">
        {label}
      </div>
      <div
        className={`font-display ${sizeClasses[size]} font-bold tracking-tight text-slate-900 tabular-nums leading-none`}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-slate-500 mt-1.5">{sub}</div>}
    </div>
  );
}
