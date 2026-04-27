/**
 * Central chart styling tokens. Charts read from this — the chart
 * components themselves never reach into raw colors. Token names map
 * to the design tokens in globals.css.
 *
 * Rules baked in here (Pew/Upshot/Stripe pattern):
 *   - Horizontal gridlines only, solid 1px
 *   - No top/right axis lines, bottom/left only
 *   - No tick marks — just numerals at 11px mono
 *   - 4–6 ticks max, round numbers only
 *   - 60–70% bar bandwidth (30–40% gap)
 *   - 2px line stroke
 *   - Annotations: thin connector + 12px sentence-fragment label
 *   - Reference lines: dashed 1px, label at end of line
 *   - Highlight bands: subtle accent-tint fill behind a range of bars
 */

export const chart = {
  color: {
    line: "var(--color-line)",
    lineStrong: "var(--color-line-strong)",
    ink: "var(--color-ink)",
    ink2: "var(--color-ink-2)",
    ink3: "var(--color-ink-3)",
    ink4: "var(--color-ink-4)",
    accent: "var(--color-accent)",
    accentTint: "var(--color-accent-tint)",
    bar: "var(--color-ink-2)", // default series color
    barHighlight: "var(--color-accent)",
    positive: "var(--color-positive)",
    negative: "var(--color-negative)",
  },
  axis: {
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    color: "var(--color-ink-3)",
    tickLength: 0, // no tick marks
    strokeWidth: 1,
  },
  grid: {
    stroke: "var(--color-line)",
    strokeWidth: 1,
    horizontal: true,
    vertical: false,
  },
  bar: {
    bandwidth: 0.65, // 65% bar, 35% gap
  },
  line: {
    strokeWidth: 2,
  },
  margin: {
    top: 16,
    right: 16,
    bottom: 32,
    left: 56,
  },
  tooltip: {
    background: "var(--color-ink)",
    color: "white",
    fontSize: 12,
    padding: "10px 12px",
    borderRadius: 0,
    minWidth: 140,
  },
  annotation: {
    // Sentence-fragment label next to a data point. NYT Upshot signature.
    fontSize: 12,
    fontFamily: "var(--font-sans)",
    color: "var(--color-ink)",
    accentColor: "var(--color-accent)",
    connectorStroke: "var(--color-ink-3)",
    connectorWidth: 1,
    // Pixel offset from the anchor along the chosen axis.
    defaultOffset: 14,
    // How far the wrapped text extends.
    maxWidth: 180,
    lineHeight: 1.25,
  },
  refLine: {
    stroke: "var(--color-ink-3)",
    strokeWidth: 1,
    dasharray: "3,3",
    labelFontSize: 10,
    labelColor: "var(--color-ink-3)",
    labelFontFamily: "var(--font-sans)",
    labelOffset: 4,
  },
  band: {
    // Subtle accent-tint fill highlighting a range of bars.
    fill: "var(--color-accent-tint)",
    labelFontSize: 10,
    labelColor: "var(--color-accent)",
    labelFontFamily: "var(--font-sans)",
  },
} as const;
