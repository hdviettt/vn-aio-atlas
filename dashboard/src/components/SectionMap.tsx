import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * SectionMap — visual table of contents for the entire study, placed
 * between the hero/Glossary and Section I. Each tile is a clickable
 * link to that section anchor with roman numeral + label + finding
 * count (or "—" for the closing sections).
 *
 * Editorial treatment: hairline grid, no shadow boxes. Hover lifts
 * the accent color on text only — no background fills.
 */
export type SectionMapItem = {
  id: string;
  number: string;
  label: string;
  count?: number; // findings inside this section, optional for closing sections
  description?: string;
};

export function SectionMap({
  eyebrow,
  title,
  items,
  countLabel,
}: {
  eyebrow: string;
  title: string;
  items: SectionMapItem[];
  countLabel: string;
}) {
  return (
    <section className="my-20 md:my-24">
      <Eyebrow tone="accent" className="mb-3">
        {eyebrow}
      </Eyebrow>
      <h2 className="font-display-tight text-[24px] md:text-[28px] font-bold text-ink leading-tight mb-10 max-w-3xl">
        {title}
      </h2>
      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
        {items.map((it) => (
          <li key={it.id} className="bg-page">
            <a
              href={`#${it.id}`}
              className="group block h-full px-5 py-6 hover:bg-card transition-colors"
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-mono-num text-[12px] text-accent font-semibold tracking-[0.18em]">
                  {it.number}
                </span>
                <span className="font-mono-num text-[10px] text-ink-4 uppercase tracking-[0.18em]">
                  {it.count !== undefined
                    ? `${it.count} ${countLabel}`
                    : "—"}
                </span>
              </div>
              <div className="text-[15px] md:text-[16px] font-semibold text-ink leading-snug group-hover:text-accent transition-colors">
                {it.label}
              </div>
              {it.description && (
                <p className="text-[12px] text-ink-3 mt-2 leading-snug">
                  {it.description}
                </p>
              )}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
