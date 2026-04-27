"use client";

import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Text } from "@visx/text";
import { chart } from "@/lib/chartTheme";

export type BarVDatum = {
  label: string;
  value: number;
  highlight?: boolean;
};

export type BarVFormat = "pct" | "num" | "raw";

export type BarVAnnotation = {
  /** Bar to anchor to (must match a datum's `label`). */
  forLabel: string;
  /** Sentence-fragment label. Multi-line if array. */
  text: string | string[];
  /** Placement relative to the anchored bar. Default "above". */
  side?: "above" | "right";
  /** If true, label uses accent color and bolder weight. */
  emphasis?: boolean;
};

export type BarVRefLine = {
  value: number;
  label?: string;
};

export type BarVBand = {
  /** First bar's label that the band starts at (inclusive). */
  fromLabel: string;
  /** Last bar's label that the band ends at (inclusive). */
  toLabel: string;
  label?: string;
};

function fmtTick(v: number, format: BarVFormat): string {
  if (format === "pct") return `${v}%`;
  if (format === "num") return v.toLocaleString("en-US");
  return String(v);
}

/**
 * BarV — vertical bars. F1 (query length × AIO presence).
 *
 * Beyond a basic bar chart, supports the publication moves that make
 * Visx worth the migration:
 *   - annotations: NYT Upshot sentence-fragment label with connector
 *   - refLines:    dashed horizontal line at a meaningful threshold
 *   - bands:       subtle shaded rectangle behind a range of bars
 *   - ticks:       sparse | "auto" | explicit array
 */
export function BarV({
  data,
  yLabel,
  format = "raw",
  height = 320,
  highlightLast = false,
  annotations = [],
  refLines = [],
  bands = [],
  ticks = "auto",
  domainMax,
  ariaLabel,
}: {
  data: BarVDatum[];
  yLabel?: string;
  format?: BarVFormat;
  height?: number;
  highlightLast?: boolean;
  annotations?: BarVAnnotation[];
  refLines?: BarVRefLine[];
  bands?: BarVBand[];
  /** "auto" = ~5 ticks, "sparse" = 0/max only, or pass an explicit list. */
  ticks?: "auto" | "sparse" | number[];
  /** Override axis max. Useful when comparing multiple charts. */
  domainMax?: number;
  /** Accessible description for screen readers. */
  ariaLabel?: string;
}) {
  return (
    <ParentSize>
      {({ width }) => {
        if (!width || data.length === 0) return null;

        const m = chart.margin;
        const innerW = Math.max(0, width - m.left - m.right);
        const innerH = Math.max(0, height - m.top - m.bottom);

        const xScale = scaleBand<string>({
          domain: data.map((d) => d.label),
          range: [0, innerW],
          padding: 1 - chart.bar.bandwidth,
        });
        const maxVal = Math.max(...data.map((d) => d.value));
        const top = domainMax ?? niceTop(maxVal, format);
        const yScale = scaleLinear<number>({
          domain: [0, top],
          range: [innerH, 0],
          nice: true,
        });

        const yTicks: number[] = Array.isArray(ticks)
          ? ticks
          : ticks === "sparse"
            ? [0, top]
            : yScale.ticks(5);

        const cellMid = (label: string) =>
          (xScale(label) ?? 0) + xScale.bandwidth() / 2;

        const fallbackLabel = data
          .map((d) => `${d.label}: ${fmtTick(d.value, format)}`)
          .join(", ");
        return (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={ariaLabel ?? fallbackLabel}
          >
            <Group left={m.left} top={m.top}>
              {/* Highlight bands — drawn first so bars sit on top */}
              {bands.map((b, i) => {
                const fromX = xScale(b.fromLabel);
                const toX = xScale(b.toLabel);
                if (fromX === undefined || toX === undefined) return null;
                const x = fromX - xScale.step() * 0.15;
                const w =
                  toX +
                  xScale.bandwidth() -
                  fromX +
                  xScale.step() * 0.3;
                return (
                  <g key={`band-${i}`}>
                    <rect
                      x={x}
                      y={0}
                      width={w}
                      height={innerH}
                      fill={chart.band.fill}
                    />
                    {b.label && (
                      <Text
                        x={x + w / 2}
                        y={-4}
                        textAnchor="middle"
                        fontSize={chart.band.labelFontSize}
                        fontFamily={chart.band.labelFontFamily}
                        fill={chart.band.labelColor}
                        fontWeight={600}
                        style={{
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                        }}
                      >
                        {b.label}
                      </Text>
                    )}
                  </g>
                );
              })}

              {/* Horizontal gridlines */}
              {yTicks.map((t) => (
                <line
                  key={`grid-${t}`}
                  x1={0}
                  x2={innerW}
                  y1={yScale(t)}
                  y2={yScale(t)}
                  stroke={chart.grid.stroke}
                  strokeWidth={chart.grid.strokeWidth}
                />
              ))}

              {/* Y-axis tick labels */}
              {yTicks.map((t) => (
                <Text
                  key={`yt-${t}`}
                  x={-8}
                  y={yScale(t)}
                  textAnchor="end"
                  verticalAnchor="middle"
                  fontSize={chart.axis.fontSize}
                  fill={chart.axis.color}
                  fontFamily={chart.axis.fontFamily}
                >
                  {fmtTick(t, format)}
                </Text>
              ))}

              {/* Reference lines */}
              {refLines.map((r, i) => {
                const y = yScale(r.value);
                return (
                  <g key={`ref-${i}`}>
                    <line
                      x1={0}
                      x2={innerW}
                      y1={y}
                      y2={y}
                      stroke={chart.refLine.stroke}
                      strokeWidth={chart.refLine.strokeWidth}
                      strokeDasharray={chart.refLine.dasharray}
                    />
                    {r.label && (
                      <Text
                        x={innerW - 4}
                        y={y - chart.refLine.labelOffset}
                        textAnchor="end"
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

              {/* Bars */}
              {data.map((d, i) => {
                const isHighlight =
                  d.highlight ?? (highlightLast && i === data.length - 1);
                const x = xScale(d.label) ?? 0;
                const y = yScale(d.value);
                const h = innerH - y;
                const w = xScale.bandwidth();
                return (
                  <g key={`bar-${d.label}`}>
                    <Bar
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill={
                        isHighlight ? chart.color.barHighlight : chart.color.bar
                      }
                    />
                    <title>{`${d.label}: ${fmtTick(d.value, format)}`}</title>
                  </g>
                );
              })}

              {/* Bar value labels (on top of bars) */}
              {data.map((d) => {
                const x = cellMid(d.label);
                const y = yScale(d.value) - 6;
                return (
                  <Text
                    key={`label-${d.label}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fontSize={11}
                    fill={chart.color.ink2}
                    fontFamily={chart.axis.fontFamily}
                  >
                    {fmtTick(d.value, format)}
                  </Text>
                );
              })}

              {/* X-axis tick labels */}
              {data.map((d) => {
                const x = cellMid(d.label);
                return (
                  <Text
                    key={`xt-${d.label}`}
                    x={x}
                    y={innerH + 18}
                    textAnchor="middle"
                    fontSize={chart.axis.fontSize}
                    fill={chart.axis.color}
                    fontFamily="var(--font-sans)"
                  >
                    {d.label}
                  </Text>
                );
              })}

              {/* Y-axis label */}
              {yLabel && (
                <Text
                  x={-m.left + 4}
                  y={-4}
                  fontSize={11}
                  fill={chart.color.ink3}
                  fontFamily="var(--font-sans)"
                  fontWeight={500}
                >
                  {yLabel}
                </Text>
              )}

              {/* Annotations — drawn last so they sit on top */}
              {annotations.map((a, i) => {
                const datum = data.find((d) => d.label === a.forLabel);
                if (!datum) return null;
                const cx = cellMid(a.forLabel);
                const cy = yScale(datum.value);
                const side = a.side ?? "above";
                return (
                  <Annotation
                    key={`ann-${i}`}
                    cx={cx}
                    cy={cy}
                    text={a.text}
                    side={side}
                    emphasis={a.emphasis}
                    chartW={innerW}
                  />
                );
              })}
            </Group>
          </svg>
        );
      }}
    </ParentSize>
  );
}

/** Round axis top up to a nice number based on format. */
function niceTop(max: number, format: BarVFormat): number {
  if (format === "pct") return Math.min(100, Math.ceil(max / 10) * 10);
  if (max <= 10) return Math.ceil(max);
  const magnitude = 10 ** Math.floor(Math.log10(max));
  return Math.ceil(max / magnitude) * magnitude;
}

/**
 * Annotation — thin connector + sentence-fragment label. Two layouts:
 *   - "above": connector goes up from bar top, label above
 *   - "right": connector goes right, label to the right of the bar
 *
 * Auto-flips horizontally if the label would overflow the chart width.
 */
function Annotation({
  cx,
  cy,
  text,
  side,
  emphasis = false,
  chartW,
}: {
  cx: number;
  cy: number;
  text: string | string[];
  side: "above" | "right";
  emphasis?: boolean;
  chartW: number;
}) {
  const lines = Array.isArray(text) ? text : [text];
  const a = chart.annotation;
  const fontWeight = emphasis ? 600 : 500;
  const color = emphasis ? a.accentColor : a.color;

  if (side === "above") {
    const offset = a.defaultOffset + 10;
    const labelY = cy - offset - lines.length * a.fontSize * a.lineHeight;
    return (
      <g>
        <line
          x1={cx}
          x2={cx}
          y1={cy - 2}
          y2={labelY + lines.length * a.fontSize * a.lineHeight - 2}
          stroke={a.connectorStroke}
          strokeWidth={a.connectorWidth}
        />
        {lines.map((ln, i) => (
          <Text
            key={i}
            x={cx}
            y={labelY + i * a.fontSize * a.lineHeight}
            textAnchor="middle"
            fontSize={a.fontSize}
            fontFamily={a.fontFamily}
            fill={color}
            fontWeight={fontWeight}
            verticalAnchor="start"
            width={a.maxWidth}
          >
            {ln}
          </Text>
        ))}
      </g>
    );
  }

  // side === "right"
  const offsetX = a.defaultOffset + 6;
  const wouldOverflow = cx + offsetX + a.maxWidth > chartW;
  const dirX = wouldOverflow ? -1 : 1;
  const labelX = cx + dirX * offsetX;
  const anchor = wouldOverflow ? "end" : "start";
  return (
    <g>
      <line
        x1={cx}
        x2={labelX - dirX * 4}
        y1={cy}
        y2={cy}
        stroke={a.connectorStroke}
        strokeWidth={a.connectorWidth}
      />
      {lines.map((ln, i) => (
        <Text
          key={i}
          x={labelX}
          y={
            cy -
            ((lines.length - 1) * a.fontSize * a.lineHeight) / 2 +
            i * a.fontSize * a.lineHeight
          }
          textAnchor={anchor}
          verticalAnchor="middle"
          fontSize={a.fontSize}
          fontFamily={a.fontFamily}
          fill={color}
          fontWeight={fontWeight}
          width={a.maxWidth}
        >
          {ln}
        </Text>
      ))}
    </g>
  );
}
