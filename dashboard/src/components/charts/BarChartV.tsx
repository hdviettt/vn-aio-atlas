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
export type ValueFormat = "pct" | "num" | "raw";

function fmt(v: unknown, format: ValueFormat = "raw"): string {
  if (typeof v !== "number") return String(v);
  if (format === "pct") return `${v.toFixed(0)}%`;
  if (format === "num") return v.toLocaleString();
  return String(v);
}

export function BarChartV({
  data,
  yLabel,
  height = 280,
  format = "raw",
}: {
  data: BarVRow[];
  yLabel?: string;
  height?: number;
  format?: ValueFormat;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 16, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#1e293b" }} />
          <YAxis
            tickFormatter={(v) => fmt(v, format)}
            tick={{ fontSize: 11, fill: "#475569" }}
            label={
              yLabel
                ? { value: yLabel, angle: -90, position: "insideLeft", fontSize: 11 }
                : undefined
            }
          />
          <Tooltip
            cursor={{ fill: "rgba(79, 70, 229, 0.08)" }}
            formatter={(v) => fmt(v, format)}
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
