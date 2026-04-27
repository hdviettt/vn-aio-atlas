import { Num, type NumberFormat } from "@/components/ui/Num";

/**
 * Stat — eyebrow label + tabular number, optional sub-caption.
 * Hero "BY THE NUMBERS" row, F2 metrics grid, etc.
 *
 * size:
 *   xl  → 32px (rare; hero-prominent)
 *   lg  → 24px (KPI rows)
 *   md  → 20px (default)
 *   sm  → 16px (inline metadata)
 */
export type StatSize = "xl" | "lg" | "md" | "sm";

const SIZE_TO_NUM: Record<StatSize, string> = {
  xl: "text-[32px] leading-none",
  lg: "text-[24px] leading-none",
  md: "text-[20px] leading-none",
  sm: "text-[16px] leading-none",
};

export function Stat({
  label,
  value,
  format = "raw",
  precision,
  suffix,
  sub,
  size = "md",
}: {
  label: string;
  value: number | string;
  format?: NumberFormat;
  precision?: number;
  suffix?: string;
  sub?: string;
  size?: StatSize;
}) {
  return (
    <div>
      <div className="eyebrow text-ink-3 mb-2">{label}</div>
      <div className={`font-num font-semibold text-ink whitespace-nowrap ${SIZE_TO_NUM[size]}`}>
        <Num value={value} format={format} precision={precision} suffix={suffix} />
      </div>
      {sub && <div className="text-[12px] text-ink-3 mt-1.5 leading-snug">{sub}</div>}
    </div>
  );
}
