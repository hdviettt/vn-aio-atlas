import type { HTMLAttributes, ReactNode } from "react";

/**
 * Card — wraps grouped content with proper border + hover affordance.
 * Used sparingly — most sections of the dashboard are flat editorial
 * layout, not card-based. Reserve for: data tables, contained widgets,
 * sidebar groups.
 */
export function Card({
  children,
  className = "",
  hoverable = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hoverable?: boolean;
}) {
  const hover = hoverable
    ? "hover:border-line-strong hover:bg-card-2"
    : "";
  return (
    <div
      className={`bg-card border border-line ${hover} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
