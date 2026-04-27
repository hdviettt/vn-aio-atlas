/**
 * Num — single source of truth for number formatting. Every number
 * shown to users goes through this component. Replaces ad-hoc
 * .toFixed() and .toLocaleString() calls scattered across the v0.4
 * codebase, where percentages used .toFixed(0) here and .toFixed(1)
 * there with no rule.
 *
 * Named `Num` (not `Number`) so the JS global `Number()` constructor
 * is still callable in the same scope.
 *
 * Formats:
 *   count    → "231,365"          (locale-aware comma separation)
 *   pct      → "80.8%"            (precision configurable, default 1)
 *   ratio    → "4.71×"            (precision configurable, default 2)
 *   float    → "157.32"           (precision configurable)
 *   pp-delta → "+2.8pp" / "−2.8pp" (signed pp delta)
 *   raw      → "459"              (integer, no separators)
 */

export type NumberFormat =
  | "count"
  | "pct"
  | "ratio"
  | "float"
  | "pp-delta"
  | "raw";

export function Num({
  value,
  format = "raw",
  precision,
  suffix,
  className = "",
}: {
  value: number | string;
  format?: NumberFormat;
  precision?: number;
  suffix?: string;
  className?: string;
}) {
  const num = typeof value === "number" ? value : Number(value);
  let text: string;

  if (Number.isNaN(num)) {
    text = "—";
  } else {
    switch (format) {
      case "count": {
        text = num.toLocaleString("en-US");
        break;
      }
      case "pct": {
        text = `${num.toFixed(precision ?? 1)}%`;
        break;
      }
      case "ratio": {
        text = `${num.toFixed(precision ?? 2)}${suffix ?? "×"}`;
        break;
      }
      case "float": {
        text = num.toFixed(precision ?? 2);
        break;
      }
      case "pp-delta": {
        const sign = num > 0 ? "+" : num < 0 ? "−" : "";
        text = `${sign}${Math.abs(num).toFixed(precision ?? 1)}pp`;
        break;
      }
      case "raw":
      default:
        text = String(num);
    }
  }

  return <span className={`font-num ${className}`}>{text}</span>;
}

/** Convenience: render a number using JetBrains Mono — for axis ticks
 *  and table cells where mono visually anchors columns. */
export function MonoNum(props: React.ComponentProps<typeof Num>) {
  return (
    <Num {...props} className={`font-mono-num ${props.className ?? ""}`} />
  );
}
