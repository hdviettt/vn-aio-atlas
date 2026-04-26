"use client";

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const INDIGO = "#4f46e5";
const INDIGO_LIGHT = "#a5b4fc";
const NAVY = "#1e1b4b";

export type LinePoint = {
  x: string;
  avg: number;
  p50: number;
  p90: number;
};

export function LineChart({ data }: { data: LinePoint[] }) {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <RechartsLineChart data={data} margin={{ top: 16, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" />
          <XAxis dataKey="x" tick={{ fontSize: 11, fill: "#475569" }} />
          <YAxis tick={{ fontSize: 11, fill: "#475569" }} />
          <Tooltip />
          <Line type="monotone" dataKey="p90" stroke={INDIGO_LIGHT} strokeWidth={1.5} dot={false} name="p90" />
          <Line type="monotone" dataKey="avg" stroke={INDIGO} strokeWidth={2.5} dot={false} name="avg" />
          <Line type="monotone" dataKey="p50" stroke={NAVY} strokeWidth={1.5} dot={false} name="p50" />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
