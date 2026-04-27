import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/**
 * ErrorState — page-level fallback when a finding fails to load. Used
 * inside a finding's chart slot so other findings can still render.
 */
export function ErrorState({
  title = "Couldn't load this finding",
  body = "Try refreshing the page. If the issue persists, the upstream pipeline may be paused.",
  action,
}: {
  title?: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-line bg-card-2 px-6 py-8 max-w-2xl flex gap-4 items-start">
      <Icon
        name={AlertTriangle}
        size={20}
        className="text-warning flex-shrink-0 mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold text-ink mb-1">{title}</div>
        <p className="text-[13px] text-ink-2 leading-relaxed">{body}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
