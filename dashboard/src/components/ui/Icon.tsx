import type { LucideIcon } from "lucide-react";

/**
 * Icon — wraps any Lucide icon with locked stroke-width and locked
 * size grid. Stroke 1.75 (not 2 — too heavy, not 1.5 — too thin).
 * Sizes: 14 / 16 / 20 / 24 only. Color inherits from currentColor.
 *
 * Usage:
 *   <Icon name={ChevronDown} size={16} />
 *   <Icon name={ArrowRight} size={20} className="text-accent" />
 */
export type IconSize = 14 | 16 | 20 | 24;

export function Icon({
  name: IconComponent,
  size = 16,
  className = "",
  "aria-label": ariaLabel,
}: {
  name: LucideIcon;
  size?: IconSize;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <IconComponent
      size={size}
      strokeWidth={1.75}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
