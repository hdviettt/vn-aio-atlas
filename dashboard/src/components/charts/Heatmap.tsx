"use client";

export type HeatmapCell = {
  row: string;
  col: string;
  value: number | null;
};

export function Heatmap({
  data,
  rowOrder,
  colOrder,
  colLabels,
  format = "pct_diff",
}: {
  data: HeatmapCell[];
  rowOrder?: string[];
  colOrder?: string[];
  colLabels?: Record<string, string>;
  format?: "pct_diff";
}) {
  const rows = rowOrder ?? Array.from(new Set(data.map((d) => d.row)));
  const cols = colOrder ?? Array.from(new Set(data.map((d) => d.col)));

  const lookup = new Map<string, number | null>();
  for (const d of data) lookup.set(`${d.row}|${d.col}`, d.value);

  const allValues = data
    .map((d) => d.value)
    .filter((v): v is number => v !== null);
  const max = Math.max(...allValues.map((v) => Math.abs(v)));

  const colorFor = (v: number | null): string => {
    if (v === null) return "#f1f5f9";
    const t = Math.max(-1, Math.min(1, v / (max || 1)));
    if (t > 0) {
      // Blue (indigo) for positive
      const intensity = Math.round(t * 100);
      return `color-mix(in srgb, #4f46e5 ${intensity}%, white)`;
    }
    if (t < 0) {
      // Red for negative
      const intensity = Math.round(-t * 100);
      return `color-mix(in srgb, #dc2626 ${intensity}%, white)`;
    }
    return "white";
  };

  const textColorFor = (v: number | null): string => {
    if (v === null) return "#94a3b8";
    const t = Math.abs(v) / (max || 1);
    return t > 0.55 ? "#fff" : "#1e293b";
  };

  const fmt = (v: number | null): string => {
    if (v === null) return "—";
    if (format === "pct_diff") return `${v >= 0 ? "+" : ""}${v.toFixed(0)}%`;
    return v.toFixed(2);
  };

  return (
    <div className="overflow-x-auto">
      <table className="border-separate" style={{ borderSpacing: 1 }}>
        <thead>
          <tr>
            <th className="bg-transparent" />
            {cols.map((c) => (
              <th
                key={c}
                className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-600 text-center"
              >
                {colLabels?.[c] ?? c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r}>
              <td className="pr-3 py-2 text-sm font-medium text-slate-900 text-right">
                {r}
              </td>
              {cols.map((c) => {
                const v = lookup.get(`${r}|${c}`) ?? null;
                return (
                  <td
                    key={c}
                    className="text-center text-xs font-bold tabular-nums"
                    style={{
                      backgroundColor: colorFor(v),
                      color: textColorFor(v),
                      width: 80,
                      height: 36,
                    }}
                  >
                    {fmt(v)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
