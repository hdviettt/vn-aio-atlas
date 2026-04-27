/**
 * Monogram — small geometric mark for the Atlas. Two stacked sans
 * letterforms ("V" and "A") composed inside a square frame, drawn at
 * single-color currentColor so it inherits from parent. Used in the
 * sidebar brand block and (simplified) as the favicon.
 *
 * Design: a wide V opening upward across the lower half, an A peak
 * over it. Reads as "VA" (Vietnam Atlas) or as a stylized mountain
 * silhouette echoing "Atlas" semantics.
 */
export function Monogram({
  size = 28,
  className = "",
  ariaLabel = "Vietnam AI Overview Atlas",
}: {
  size?: number;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      {/* Frame: thin square outline */}
      <rect
        x={1}
        y={1}
        width={30}
        height={30}
        stroke="currentColor"
        strokeWidth={1.5}
        fill="none"
      />
      {/* "V" inside — wide stroke, ascending from baseline */}
      <path
        d="M7 11 L16 23 L25 11"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      {/* "A" peak — bridges over the V */}
      <path
        d="M11 17 L19 17"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="square"
      />
    </svg>
  );
}
