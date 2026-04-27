import { ImageResponse } from "next/og";

/**
 * Dynamic OG image — Next.js file convention picks this up automatically
 * and overrides the manual openGraph.images entry. 1200×630 is the
 * standard Twitter/Facebook social card size.
 *
 * Visual: monogram + wordmark on cream, big editorial headline finding,
 * SEONGON byline. Inter is loaded via system-font fallbacks since the
 * @vercel/og runtime doesn't ship Inter without an explicit fetch — we
 * keep the OG card system-font and rely on weight + tracking for feel.
 */

export const runtime = "edge";
export const alt = "Vietnam AI Overview Atlas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fafafa",
        padding: "72px 80px",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        color: "#18181b",
      }}
    >
      {/* Brand row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <svg
          width={48}
          height={48}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x={3}
            y={3}
            width={26}
            height={26}
            stroke="#4f46e5"
            strokeWidth={2}
            fill="none"
          />
          <path
            d="M9 9 L16 22 L23 9"
            stroke="#4f46e5"
            strokeWidth={2}
            strokeLinecap="square"
            strokeLinejoin="miter"
            fill="none"
          />
          <path d="M12.5 17 L19.5 17" stroke="#4f46e5" strokeWidth={2} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#4f46e5",
            }}
          >
            atlas
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#18181b",
              letterSpacing: "-0.01em",
            }}
          >
            Vietnam AI Overview
          </div>
        </div>
      </div>

      {/* Headline finding */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#4f46e5",
          }}
        >
          headline finding
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            color: "#18181b",
            maxWidth: 1040,
          }}
        >
          AI Overviews now appear on the majority of Vietnamese commercial
          searches.
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: "#52525b",
            lineHeight: 1.4,
            maxWidth: 880,
          }}
        >
          An empirical study of 244K queries and 1.4M citation events across
          12 verticals — December 2025 through April 2026.
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontSize: 16,
          color: "#71717a",
          letterSpacing: "0.04em",
        }}
      >
        <div style={{ display: "flex", gap: 24 }}>
          <span>231,365 rows</span>
          <span style={{ color: "#a1a1aa" }}>·</span>
          <span>264 brand projects</span>
          <span style={{ color: "#a1a1aa" }}>·</span>
          <span>12 verticals</span>
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#52525b",
          }}
        >
          SEONGON · 2026
        </div>
      </div>
    </div>,
    size,
  );
}
