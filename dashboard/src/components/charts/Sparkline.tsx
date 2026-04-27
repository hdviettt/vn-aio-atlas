"use client";

/**
 * Sparkline — minimal SVG sparkline. F12 inline trend column. Uses the
 * accent token via currentColor so it inherits from parent.
 */
export function Sparkline({
  values,
  width = 80,
  height = 22,
}: {
  values: number[];
  width?: number;
  height?: number;
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
    <svg
      width={width}
      height={height}
      className="inline-block align-middle text-accent"
      aria-hidden="true"
      focusable="false"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle
        cx={padding + (values.length - 1) * stepX}
        cy={
          padding +
          (height - padding * 2) *
            (1 - (values[values.length - 1] - min) / range)
        }
        r={2}
        fill="currentColor"
      />
    </svg>
  );
}
