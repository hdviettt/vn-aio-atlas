"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Button — three variants, two sizes. No raw <button className="…">
 * anywhere outside this file.
 *
 * Variants:
 *   primary   — filled accent (rare; reserved for primary CTAs)
 *   secondary — bordered card surface, ink text (default for most UI)
 *   ghost     — text-only, hover-tint (for low-emphasis controls)
 *
 * Sizes: sm = 28px tall, md = 36px tall.
 */
type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover active:bg-accent-hover " +
    "border border-accent",
  secondary:
    "bg-card text-ink hover:bg-card-2 active:bg-card-2 " +
    "border border-line hover:border-line-strong",
  ghost:
    "bg-transparent text-ink-2 hover:text-ink hover:bg-card-2 " +
    "border border-transparent",
};

const SIZE: Record<Size, string> = {
  sm: "h-7 px-2.5 text-[13px]",
  md: "h-9 px-3.5 text-sm",
};

export function Button({
  children,
  variant = "secondary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 font-medium leading-none ${VARIANT[variant]} ${SIZE[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
