import { Num } from "@/components/ui/Num";

/**
 * MiniBars — compact horizontal bar list, used in small-multiples
 * arrangements (F6 top-cited per vertical). Each row is normalized to
 * the leader's value within this group, so the visual encodes
 * within-group concentration.
 *
 * No axis, no chart chrome — the value at the end of each bar is the
 * only numeric reference point. Designed to fit 4–5 rows in ~120px
 * vertical space.
 */
export type MiniBarRow = {
  label: string;
  value: number;
  rank?: number | string;
};

export function MiniBars({
  rows,
  format = "count",
  rowHeight = 22,
}: {
  rows: MiniBarRow[];
  format?: "count" | "raw" | "pct";
  rowHeight?: number;
}) {
  if (rows.length === 0) return null;
  const max = Math.max(...rows.map((r) => r.value));

  return (
    <div className="space-y-px">
      {rows.map((r) => {
        const pct = max === 0 ? 0 : (r.value / max) * 100;
        return (
          <div
            key={r.label}
            className="grid grid-cols-[24px_1fr_auto] items-center gap-3 border-b border-line"
            style={{ minHeight: rowHeight }}
          >
            {r.rank !== undefined && (
              <span className="font-mono-num text-[11px] text-ink-4">
                {r.rank}
              </span>
            )}
            <div className="relative min-w-0">
              <span className="block truncate text-[13px] font-medium text-ink relative z-10 py-1.5">
                {r.label}
              </span>
              {/* Bar fill — sits behind the label as a subtle indicator */}
              <span
                className="absolute inset-y-0 left-0 bg-accent-tint pointer-events-none"
                style={{ width: `${pct}%` }}
                aria-hidden="true"
              />
            </div>
            <span className="font-mono-num text-[11px] text-ink-3">
              <Num value={r.value} format={format} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
