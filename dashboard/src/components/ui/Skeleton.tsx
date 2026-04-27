/**
 * Skeleton — soft placeholder block for loading states. Animated via
 * the global `animate-pulse-soft` keyframe in globals.css. Sized via
 * width/height props or className overrides.
 *
 * Use sparingly: most of the dashboard is server-rendered, so skeletons
 * are only needed for client-side data refreshes (e.g. vertical filter
 * change rebuilding charts).
 */
export function Skeleton({
  width,
  height = 16,
  className = "",
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) {
  const w = typeof width === "number" ? `${width}px` : width;
  const h = typeof height === "number" ? `${height}px` : height;
  return (
    <span
      className={`block bg-card-2 animate-pulse-soft ${className}`}
      style={{ width: w ?? "100%", height: h }}
      aria-hidden="true"
    />
  );
}

/**
 * ChartSkeleton — placeholder for a chart while data resolves. Mirrors
 * the typical chart aspect ratio so layout doesn't reflow.
 */
export function ChartSkeleton({
  rows = 6,
  className = "",
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 max-w-3xl ${className}`} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton width={80} height={12} />
          <Skeleton
            height={20}
            className="flex-1"
            width={`${30 + ((i * 17) % 60)}%`}
          />
        </div>
      ))}
    </div>
  );
}
