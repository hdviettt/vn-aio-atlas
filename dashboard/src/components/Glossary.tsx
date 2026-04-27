import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Glossary — short definition list for jargon used throughout the
 * Atlas. Editorial treatment: no box, no card-fill, no accent left
 * border. Single hairline top + bottom + row separators do all the
 * structural work. Term as inline-left, definition as inline-right
 * — like the ledger pages of an Encyclopædia entry.
 */
export function Glossary({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: { term: string; definition: string }[];
}) {
  return (
    <section className="my-20 md:my-24">
      <Eyebrow tone="accent" className="mb-3">
        {eyebrow}
      </Eyebrow>
      <h3 className="font-display-tight text-[22px] md:text-[26px] font-semibold text-ink mb-10 max-w-2xl leading-tight">
        {title}
      </h3>
      <dl className="border-t border-line-strong">
        {items.map((it) => (
          <div
            key={it.term}
            className="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-x-10 gap-y-2 py-5 border-b border-line"
          >
            <dt className="text-[14px] font-semibold text-ink leading-snug">
              {it.term}
            </dt>
            <dd className="text-[14px] text-ink-2 leading-relaxed max-w-2xl">
              {it.definition}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
