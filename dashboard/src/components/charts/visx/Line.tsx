"use client";

import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { Text } from "@visx/text";
import {
  defaultStyles,
  useTooltip,
  useTooltipInPortal,
} from "@visx/tooltip";
import { bisector } from "@visx/vendor/d3-array";
import { localPoint } from "@visx/event";
import { chart } from "@/lib/chartTheme";

export type LinePoint = {
  x: string; // ISO date string
  avg: number;
  p50: number;
  p90: number;
};

export type LineRefLine = {
  value: number;
  label?: string;
};

const bisectDate = bisector<LinePoint, Date>((d) => new Date(d.x)).left;

const tooltipStyles = {
  ...defaultStyles,
  background: "var(--color-ink)",
  color: "white",
  fontSize: 12,
  padding: "10px 12px",
  borderRadius: 0,
  minWidth: 160,
  boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
  fontFamily: "var(--font-sans)",
  // Tooltip positioning is handled below — keep transform stable.
};

/**
 * Line — F4 (AIO length over time). Three lines: p90 (faintest), avg
 * (highlight), p50 (mid). Adds the publication moves Recharts couldn't
 * give us:
 *   - End-of-line series labels include the value, not just the name
 *   - Reference line at corpus-wide average
 *   - Designed tooltip on hover (dark bg, tabular value first)
 *   - Vertical guideline + dot at the hovered x
 */
export function LineChart({
  data,
  height = 320,
  refLines = [],
  ariaLabel,
}: {
  data: LinePoint[];
  height?: number;
  refLines?: LineRefLine[];
  /** Accessible description for screen readers. */
  ariaLabel?: string;
}) {
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<LinePoint>();
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  });

  return (
    <ParentSize>
      {({ width }) => {
        if (!width || data.length === 0) return null;

        const m = { ...chart.margin, top: 24, right: 56 };
        const innerW = Math.max(0, width - m.left - m.right);
        const innerH = Math.max(0, height - m.top - m.bottom);

        const dates = data.map((d) => new Date(d.x));
        const xScale = scaleTime<number>({
          domain: [dates[0], dates[dates.length - 1]],
          range: [0, innerW],
        });

        const allVals = data.flatMap((d) => [d.avg, d.p50, d.p90]);
        const maxVal = Math.max(...allVals);
        const minVal = Math.min(...allVals);
        const yScale = scaleLinear<number>({
          domain: [Math.max(0, minVal * 0.9), maxVal * 1.05],
          range: [innerH, 0],
          nice: true,
        });

        const yTicks = yScale.ticks(5);

        const handleMove = (
          event: React.MouseEvent<SVGRectElement> | React.TouchEvent<SVGRectElement>,
        ) => {
          const point = localPoint(event);
          if (!point) return;
          const xInChart = point.x - m.left;
          const date = xScale.invert(xInChart);
          const index = bisectDate(data, date, 1);
          const left = data[index - 1];
          const right = data[index];
          let pointDatum: LinePoint;
          if (!right) {
            pointDatum = left;
          } else if (!left) {
            pointDatum = right;
          } else {
            pointDatum =
              date.valueOf() - new Date(left.x).valueOf() <
              new Date(right.x).valueOf() - date.valueOf()
                ? left
                : right;
          }
          showTooltip({
            tooltipData: pointDatum,
            tooltipLeft: xScale(new Date(pointDatum.x)) + m.left,
            tooltipTop: yScale(pointDatum.avg) + m.top,
          });
        };

        const last = data[data.length - 1];
        const lastX = xScale(new Date(last.x)) + 6;

        const first = data[0];
        const fallbackLabel = `Time series. First: ${first.x}, avg ${first.avg}. Last: ${last.x}, avg ${last.avg}.`;
        return (
          <div style={{ position: "relative" }}>
            <svg
              width={width}
              height={height}
              ref={containerRef}
              role="img"
              aria-label={ariaLabel ?? fallbackLabel}
            >
              <Group left={m.left} top={m.top}>
                {/* Horizontal gridlines */}
                {yTicks.map((t) => (
                  <line
                    key={`grid-${t}`}
                    x1={0}
                    x2={innerW}
                    y1={yScale(t)}
                    y2={yScale(t)}
                    stroke={chart.grid.stroke}
                    strokeWidth={1}
                  />
                ))}

                {/* Y-axis labels */}
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
                    {t.toLocaleString("en-US")}
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
                          x={4}
                          y={y - chart.refLine.labelOffset}
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

                {/* Lines */}
                <LinePath<LinePoint>
                  data={data}
                  x={(d) => xScale(new Date(d.x))}
                  y={(d) => yScale(d.p90)}
                  stroke={chart.color.ink4}
                  strokeWidth={1.5}
                />
                <LinePath<LinePoint>
                  data={data}
                  x={(d) => xScale(new Date(d.x))}
                  y={(d) => yScale(d.avg)}
                  stroke={chart.color.accent}
                  strokeWidth={2}
                />
                <LinePath<LinePoint>
                  data={data}
                  x={(d) => xScale(new Date(d.x))}
                  y={(d) => yScale(d.p50)}
                  stroke={chart.color.ink2}
                  strokeWidth={1.5}
                />

                {/* End-of-line series labels with values */}
                <Text
                  x={lastX}
                  y={yScale(last.p90)}
                  verticalAnchor="middle"
                  fontSize={11}
                  fill={chart.color.ink4}
                  fontFamily="var(--font-sans)"
                >
                  {`p90 · ${last.p90.toLocaleString("en-US")}`}
                </Text>
                <Text
                  x={lastX}
                  y={yScale(last.avg)}
                  verticalAnchor="middle"
                  fontSize={11}
                  fill={chart.color.accent}
                  fontFamily="var(--font-sans)"
                  fontWeight={600}
                >
                  {`avg · ${last.avg.toLocaleString("en-US")}`}
                </Text>
                <Text
                  x={lastX}
                  y={yScale(last.p50)}
                  verticalAnchor="middle"
                  fontSize={11}
                  fill={chart.color.ink2}
                  fontFamily="var(--font-sans)"
                >
                  {`p50 · ${last.p50.toLocaleString("en-US")}`}
                </Text>

                {/* X-axis tick labels — first, mid, last */}
                {[0, Math.floor(data.length / 2), data.length - 1].map((i) => {
                  const d = data[i];
                  if (!d) return null;
                  const date = new Date(d.x);
                  const labelText = `${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear().toString().slice(-2)}`;
                  return (
                    <Text
                      key={`xt-${i}`}
                      x={xScale(date)}
                      y={innerH + 18}
                      textAnchor="middle"
                      fontSize={chart.axis.fontSize}
                      fill={chart.axis.color}
                      fontFamily="var(--font-sans)"
                    >
                      {labelText}
                    </Text>
                  );
                })}

                {/* Hover guideline + dots when tooltip is open */}
                {tooltipData && (
                  <g>
                    <line
                      x1={xScale(new Date(tooltipData.x))}
                      x2={xScale(new Date(tooltipData.x))}
                      y1={0}
                      y2={innerH}
                      stroke={chart.color.accent}
                      strokeWidth={1}
                      pointerEvents="none"
                    />
                    {(["p90", "avg", "p50"] as const).map((k) => {
                      const fill =
                        k === "avg"
                          ? chart.color.accent
                          : k === "p50"
                            ? chart.color.ink2
                            : chart.color.ink4;
                      return (
                        <circle
                          key={k}
                          cx={xScale(new Date(tooltipData.x))}
                          cy={yScale(tooltipData[k])}
                          r={3.5}
                          fill={fill}
                          stroke="white"
                          strokeWidth={1.5}
                          pointerEvents="none"
                        />
                      );
                    })}
                  </g>
                )}

                {/* Hover capture rect — full chart area */}
                <rect
                  x={0}
                  y={0}
                  width={innerW}
                  height={innerH}
                  fill="transparent"
                  onMouseMove={handleMove}
                  onMouseLeave={hideTooltip}
                  onTouchMove={handleMove}
                  onTouchEnd={hideTooltip}
                />
              </Group>
            </svg>

            {tooltipData && (
              <TooltipInPortal
                key={tooltipLeft}
                left={tooltipLeft}
                top={tooltipTop - 12}
                style={tooltipStyles}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.02em",
                    marginBottom: 6,
                  }}
                >
                  {new Date(tooltipData.x).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <TooltipRow
                  label="avg"
                  value={tooltipData.avg}
                  color={chart.color.accent}
                  bold
                />
                <TooltipRow
                  label="p50"
                  value={tooltipData.p50}
                  color="rgba(255,255,255,0.85)"
                />
                <TooltipRow
                  label="p90"
                  value={tooltipData.p90}
                  color="rgba(255,255,255,0.65)"
                />
              </TooltipInPortal>
            )}
          </div>
        );
      }}
    </ParentSize>
  );
}

function TooltipRow({
  label,
  value,
  color,
  bold = false,
}: {
  label: string;
  value: number;
  color: string;
  bold?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        marginTop: 2,
        marginBottom: 2,
      }}
    >
      <span
        style={{
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontSize: 10,
          color: "rgba(255,255,255,0.55)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          fontVariantNumeric: "tabular-nums",
          color,
          fontWeight: bold ? 600 : 400,
        }}
      >
        {value.toLocaleString("en-US")}
      </span>
    </div>
  );
}
