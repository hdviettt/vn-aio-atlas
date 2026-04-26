"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const INDIGO = "#4f46e5";

export type BarVRow = { label: string; value: number };

export function BarChartV({
  data,
  yLabel,
  height = 280,
  valueFormatter,
}: {
  data: BarVRow[];
  yLabel?: string;
  height?: number;
  valueFormatter?: (v: number) => string;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 16, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#1e293b" }} />
          <YAxis
            tickFormatter={valueFormatter}
            tick={{ fontSize: 11, fill: "#475569" }}
            label={
              yLabel
                ? { value: yLabel, angle: -90, position: "insideLeft", fontSize: 11 }
                : undefined
            }
          />
          <Tooltip
            cursor={{ fill: "rgba(79, 70, 229, 0.08)" }}
            formatter={(v) =>
              typeof v === "number" && valueFormatter ? valueFormatter(v) : String(v)
            }
          />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={INDIGO} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
