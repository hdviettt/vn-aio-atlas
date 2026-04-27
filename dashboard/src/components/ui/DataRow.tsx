import { Num, type NumberFormat } from "@/components/ui/Num";

/**
 * DataRow — definition-list pattern (<dt>/<dd>). Tighter and more
 * dignified than Stat for editorial metadata blocks.
 *
 * Used in: hero metadata block, F2 metrics grid in compact contexts.
 */
export function DataRow({
  label,
  value,
  format = "raw",
  precision,
  suffix,
  sub,
}: {
  label: string;
  value: number | string;
  format?: NumberFormat;
  precision?: number;
  suffix?: string;
  sub?: string;
}) {
  return (
    <div>
      <dt className="eyebrow text-ink-3 mb-1.5">{label}</dt>
      <dd className="font-num font-semibold text-ink text-[20px] leading-none whitespace-nowrap">
        <Num value={value} format={format} precision={precision} suffix={suffix} />
      </dd>
      {sub && <div className="text-[12px] text-ink-3 mt-1.5">{sub}</div>}
    </div>
  );
}
