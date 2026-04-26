"use client";

export function Sparkline({
  values,
  width = 80,
  height = 22,
  color = "#4f46e5",
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 2;

  const stepX = (width - padding * 2) / (values.length - 1);
  const points = values
    .map(
      (v, i) =>
        `${padding + i * stepX},${
          padding + (height - padding * 2) * (1 - (v - min) / range)
        }`,
    )
    .join(" ");

  return (
    <svg width={width} height={height} className="inline-block align-middle">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* Endpoint dot for the latest value */}
      <circle
        cx={padding + (values.length - 1) * stepX}
        cy={
          padding +
          (height - padding * 2) * (1 - (values[values.length - 1] - min) / range)
        }
        r={2}
        fill={color}
      />
    </svg>
  );
}
