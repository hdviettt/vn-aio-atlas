/**
 * RatioBar — single horizontal bar split into two segments. Used for
 * F2: showing the in-top-10 vs outside-top-10 citation ratio at a
 * glance.
 *
 * The right segment uses accent so the "outside top-10" finding is the
 * one that draws the eye. Each segment is labeled above, with the
 * percentage and a sentence-fragment description.
 */
export function RatioBar({
  left,
  right,
  height = 32,
}: {
  left: { value: number; label: string; sub?: string };
  right: { value: number; label: string; sub?: string };
  height?: number;
}) {
  const total = left.value + right.value;
  const leftPct = total === 0 ? 50 : (left.value / total) * 100;
  const rightPct = 100 - leftPct;

  return (
    <div className="max-w-3xl">
      {/* Bar */}
      <div
        className="flex w-full overflow-hidden border border-line"
        style={{ height }}
        role="img"
        aria-label={`${left.label}: ${left.value.toFixed(1)}%, ${right.label}: ${right.value.toFixed(1)}%`}
      >
        <div
          className="bg-ink-3 flex items-center justify-end pr-2"
          style={{ width: `${leftPct}%` }}
        >
          {leftPct > 14 && (
            <span className="font-mono-num text-[11px] text-white font-semibold">
              {left.value.toFixed(0)}%
            </span>
          )}
        </div>
        <div
          className="bg-accent flex items-center justify-start pl-2"
          style={{ width: `${rightPct}%` }}
        >
          {rightPct > 14 && (
            <span className="font-mono-num text-[11px] text-white font-semibold">
              {right.value.toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      {/* Legend rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block w-2 h-2 bg-ink-3"
              aria-hidden="true"
            />
            <div className="text-[13px] font-medium text-ink">{left.label}</div>
          </div>
          {left.sub && (
            <div className="text-[12px] text-ink-3 leading-snug pl-4">
              {left.sub}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block w-2 h-2 bg-accent"
              aria-hidden="true"
            />
            <div className="text-[13px] font-medium text-ink">
              {right.label}
            </div>
          </div>
          {right.sub && (
            <div className="text-[12px] text-ink-3 leading-snug pl-4">
              {right.sub}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
