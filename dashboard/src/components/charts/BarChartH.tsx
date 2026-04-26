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

export function BarChartH({
  data,
  xLabel,
  height = 320,
  valueFormatter,
}: {
  data: BarRow[];
  xLabel?: string;
  height?: number;
  valueFormatter?: (v: number) => string;
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
            tickFormatter={valueFormatter}
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
            formatter={(v) =>
              typeof v === "number" && valueFormatter ? valueFormatter(v) : String(v)
            }
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
