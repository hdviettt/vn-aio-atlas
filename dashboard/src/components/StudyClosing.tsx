import type { ReactNode } from "react";

/**
 * StudyClosing — wraps the long-form prose blocks (Methodology,
 * Limitations, "What we still don't know") that close out the Atlas
 * as a self-contained study. Sits between the last finding and the
 * footer.
 *
 * Children are rendered inside an article element with a comfortable
 * reading column (max-w-2xl). Each child block can include its own
 * eyebrow + heading + paragraphs.
 */
export function StudyClosing({ children }: { children: ReactNode }) {
  return (
    <article className="prose-atlas max-w-none">{children}</article>
  );
}

/**
 * ClosingBlock — a single block within StudyClosing. Renders an
 * editorial heading + freeform body text. Multiple ClosingBlocks
 * stack with hairlines between them.
 */
export function ClosingBlock({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="py-12 border-t border-line first:border-t-0 first:pt-0 max-w-2xl">
      <div className="eyebrow text-accent mb-3">{eyebrow}</div>
      <h3 className="font-display-tight text-[24px] md:text-[28px] font-bold text-ink leading-tight mb-6 max-w-prose">
        {title}
      </h3>
      <div className="text-[15px] md:text-[16px] text-ink-2 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:text-ink [&_strong]:font-semibold [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-line-strong">
        {children}
      </div>
    </section>
  );
}
