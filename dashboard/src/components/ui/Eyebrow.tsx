import type { ReactNode } from "react";

/**
 * Eyebrow — small caps label, repeated 30+ times across the page in
 * v0.4. Use for: section labels (FINDING 1), context tags (BY THE
 * NUMBERS), category indicators.
 *
 * Tones:
 *   - accent (default for finding eyebrows): indigo
 *   - muted: tertiary text gray
 *   - ink: primary text gray
 */
export function Eyebrow({
  children,
  tone = "accent",
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  tone?: "accent" | "muted" | "ink";
  className?: string;
  as?: "div" | "span" | "p";
}) {
  const tones: Record<string, string> = {
    accent: "text-accent",
    muted: "text-ink-3",
    ink: "text-ink-2",
  };
  return (
    <Tag className={`eyebrow ${tones[tone]} ${className}`}>{children}</Tag>
  );
}
