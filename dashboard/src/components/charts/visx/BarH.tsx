"use client";

import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Text } from "@visx/text";
import { chart } from "@/lib/chartTheme";

export type BarHDatum = {
  label: string;
  value: number;
  highlight?: boolean;
  sub?: string;
};

export type BarHFormat = "pct" | "num" | "raw";

export type BarHAnnotation = {
  /** Row label to anchor to. */
  forLabel: string;
  /** Sentence-fragment label, shown to the right of the value. */
  text: string;
  emphasis?: boolean;
};

export type BarHRefLine = {
  value: number;
  label?: string;
};

function fmtVal(v: number, format: BarHFormat): string {
  if (format === "pct") return `${v.toFixed(1)}%`;
  if (format === "num") return v.toLocaleString("en-US");
  return String(v);
}

/**
 * BarH — horizontal bars. F3 (top cited domains), F5 (AIO rate by
 * vertical), F7 (concentration), F8 (overlap), F10 (AIO chars by
 * vertical). Each row: label on the left, bar in the middle, value at
 * the end of the bar.
 *
 * Supports annotations (right of value) and refLines (vertical dashed
 * line at a meaningful threshold, e.g. corpus average).
 */
export function BarH({
  data,
  xLabel,
  format = "raw",
  height,
  highlightTop = false,
  labelWidth = 160,
  rowHeight = 28,
  valueColumnWidth = 64,
  annotations = [],
  refLines = [],
  ariaLabel,
}: {
  data: BarHDatum[];
  xLabel?: string;
  format?: BarHFormat;
  height?: number;
  highlightTop?: boolean;
  labelWidth?: number;
  rowHeight?: number;
  /** Pixels reserved at the right edge for the value label. */
  valueColumnWidth?: number;
  annotations?: BarHAnnotation[];
  refLines?: BarHRefLine[];
  /** Accessible description for screen readers. */
  ariaLabel?: string;
}) {
  const computedHeight = height ?? Math.max(160, data.length * rowHeight + 48);

  return (
    <ParentSize>
      {({ width }) => {
        if (!width || data.length === 0) return null;

        // Mobile-aware spacing. On narrow viewports, cap label width and
        // shrink the value/annotation reserve so the bar doesn't vanish.
        const isNarrow = width < 520;
        const effectiveLabelWidth = isNarrow
          ? Math.min(labelWidth, 96)
          : labelWidth;
        const effectiveValueCol = isNarrow ? 48 : valueColumnWidth;
        // Hide annotations on narrow viewports — there isn't space, and
        // forcing them creates an unreadable squeeze.
        const showAnnotations = !isNarrow && annotations.length > 0;
        const annotationCol = showAnnotations ? 200 : 0;
        const m = { ...chart.margin, left: effectiveLabelWidth + 8 };
        const innerW = Math.max(
          0,
          width - m.left - m.right - effectiveValueCol - annotationCol,
        );
        const innerH = Math.max(0, computedHeight - m.top - m.bottom);

        const yScale = scaleBand<string>({
          domain: data.map((d) => d.label),
          range: [0, innerH],
          padding: 1 - chart.bar.bandwidth,
        });
        const maxVal = Math.max(...data.map((d) => d.value));
        const xScale = scaleLinear<number>({
          domain: [0, niceTop(maxVal, format)],
          range: [0, innerW],
          nice: true,
        });

        const rowMid = (label: string) =>
          (yScale(label) ?? 0) + yScale.bandwidth() / 2;

        const fallbackLabel = data
          .map((d) => `${d.label}: ${fmtVal(d.value, format)}`)
          .join(", ");
        return (
          <svg
            width={width}
            height={computedHeight}
            role="img"
            aria-label={ariaLabel ?? fallbackLabel}
          >
            <Group left={m.left} top={m.top}>
              {/* X-axis label (above the bars, not below) */}
              {xLabel && (
                <Text
                  x={0}
                  y={-4}
                  fontSize={11}
                  fill={chart.color.ink3}
                  fontFamily="var(--font-sans)"
                >
                  {xLabel}
                </Text>
              )}

              {/* Reference lines (vertical, since bars are horizontal) */}
              {refLines.map((r, i) => {
                const x = xScale(r.value);
                return (
                  <g key={`ref-${i}`}>
                    <line
                      x1={x}
                      x2={x}
                      y1={0}
                      y2={innerH}
                      stroke={chart.refLine.stroke}
                      strokeWidth={chart.refLine.strokeWidth}
                      strokeDasharray={chart.refLine.dasharray}
                    />
                    {r.label && (
                      <Text
                        x={x}
                        y={-4}
                        textAnchor="middle"
                        fontSize={chart.refLine.labelFontSize}
                        fontFamily={chart.refLine.labelFontFamily}
                        fill={chart.refLine.labelColor}
                        fontStyle="italic"
                      >
                        {r.label}
                      </Text>
                    )}
                  </g>
                );
              })}

              {/* Bars + labels + values */}
              {data.map((d, i) => {
                const isHighlight = d.highlight ?? (highlightTop && i === 0);
                const y = yScale(d.label) ?? 0;
                const w = xScale(d.value);
                const h = yScale.bandwidth();
                return (
                  <g key={`row-${d.label}`}>
                    {/* Row label (to the left of the bar) */}
                    <Text
                      x={-12}
                      y={y + h / 2}
                      textAnchor="end"
                      verticalAnchor="middle"
                      fontSize={13}
                      fill={chart.color.ink}
                      fontFamily="var(--font-sans)"
                      fontWeight={500}
                    >
                      {d.label}
                    </Text>
                    {/* Bar */}
                    <Bar
                      x={0}
                      y={y}
                      width={w}
                      height={h}
                      fill={
                        isHighlight ? chart.color.barHighlight : chart.color.bar
                      }
                    />
                    <title>{`${d.label}: ${fmtVal(d.value, format)}`}</title>
                    {/* Value at end of bar */}
                    <Text
                      x={w + 6}
                      y={y + h / 2}
                      verticalAnchor="middle"
                      fontSize={11}
                      fill={chart.color.ink2}
                      fontFamily={chart.axis.fontFamily}
                      fontWeight={isHighlight ? 600 : 400}
                    >
                      {fmtVal(d.value, format)}
                    </Text>
                    {/* Optional sub-label below the row label */}
                    {d.sub && (
                      <Text
                        x={-12}
                        y={y + h / 2 + 14}
                        textAnchor="end"
                        verticalAnchor="middle"
                        fontSize={10}
                        fill={chart.color.ink3}
                        fontFamily="var(--font-sans)"
                      >
                        {d.sub}
                      </Text>
                    )}
                  </g>
                );
              })}

              {/* Annotations — to the right of the value column */}
              {showAnnotations && annotations.map((a, i) => {
                const datum = data.find((d) => d.label === a.forLabel);
                if (!datum) return null;
                const y = rowMid(a.forLabel);
                const xStart = xScale(datum.value) + effectiveValueCol - 4;
                const xLabelStart = xStart + 12;
                const color = a.emphasis
                  ? chart.annotation.accentColor
                  : chart.annotation.color;
                return (
                  <g key={`ann-${i}`}>
                    <line
                      x1={xStart}
                      x2={xLabelStart - 4}
                      y1={y}
                      y2={y}
                      stroke={chart.annotation.connectorStroke}
                      strokeWidth={chart.annotation.connectorWidth}
                    />
                    <Text
                      x={xLabelStart}
                      y={y}
                      verticalAnchor="middle"
                      fontSize={chart.annotation.fontSize}
                      fontFamily={chart.annotation.fontFamily}
                      fill={color}
                      fontWeight={a.emphasis ? 600 : 500}
                      width={annotationCol - 16}
                    >
                      {a.text}
                    </Text>
                  </g>
                );
              })}
            </Group>
          </svg>
        );
      }}
    </ParentSize>
  );
}

function niceTop(max: number, format: BarHFormat): number {
  if (format === "pct") return Math.min(100, Math.ceil(max / 10) * 10);
  if (max <= 10) return Math.ceil(max);
  const magnitude = 10 ** Math.floor(Math.log10(max));
  return Math.ceil(max / magnitude) * magnitude;
}
