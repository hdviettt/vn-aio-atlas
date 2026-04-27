import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * EmptyState — shown when filters return zero rows or a finding has no
 * data for the current vertical. Quiet, dignified, never decorated.
 */
export function EmptyState({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-line-strong px-6 py-10 max-w-2xl">
      {eyebrow && (
        <Eyebrow tone="muted" className="mb-2">
          {eyebrow}
        </Eyebrow>
      )}
      <div className="text-[18px] font-semibold text-ink mb-2">{title}</div>
      {body && <p className="text-[14px] text-ink-2 leading-relaxed">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
