import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * SectionDivider — chapter-style break between thematic groups of
 * findings. Editorial treatment: single hairline (1px) and roomy
 * top padding so each section opens with breath, not a slap.
 *
 * The roman numeral is set in mono next to a small accent eyebrow
 * — like a Stripe Press chapter header. The H2 title sits below
 * with editorial display tracking, the intro paragraph after.
 */
export function SectionDivider({
  id,
  number,
  eyebrow,
  title,
  intro,
}: {
  id?: string;
  number: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-8 pt-24 md:pt-32 pb-10 mt-12 border-t border-line-strong"
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="font-mono-num text-[12px] text-accent tracking-[0.18em]">
          {number}
        </span>
        <span className="h-px flex-1 max-w-[3rem] bg-accent" aria-hidden="true" />
        <Eyebrow tone="accent" className="!tracking-[0.22em]">
          {eyebrow}
        </Eyebrow>
      </div>
      <h2 className="font-display-tight text-[34px] md:text-[48px] font-bold text-ink leading-[1.05] mb-6 max-w-3xl tracking-[-0.025em]">
        {title}
      </h2>
      {intro && (
        <p className="text-[16px] md:text-[18px] text-ink-2 leading-relaxed max-w-2xl">
          {intro}
        </p>
      )}
    </section>
  );
}
