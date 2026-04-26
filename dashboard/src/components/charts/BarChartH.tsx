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

export type BarRow = { label: string; value: number; sub?: string };
export type ValueFormat = "pct" | "num" | "raw";

function fmt(v: unknown, format: ValueFormat = "raw"): string {
  if (typeof v !== "number") return String(v);
  if (format === "pct") return `${v.toFixed(1)}%`;
  if (format === "num") return v.toLocaleString();
  return String(v);
}

export function BarChartH({
  data,
  xLabel,
  height = 320,
  format = "raw",
}: {
  data: BarRow[];
  xLabel?: string;
  height?: number;
  format?: ValueFormat;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
        >
          <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => fmt(v, format)}
            tick={{ fontSize: 11, fill: "#475569" }}
            label={
              xLabel
                ? { value: xLabel, position: "insideBottom", offset: -4, fontSize: 11 }
                : undefined
            }
          />
          <YAxis
            type="category"
            dataKey="label"
            width={150}
            tick={{ fontSize: 11, fill: "#1e293b" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(79, 70, 229, 0.08)" }}
            formatter={(v) => fmt(v, format)}
          />
          <Bar dataKey="value" radius={[0, 0, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={INDIGO} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
