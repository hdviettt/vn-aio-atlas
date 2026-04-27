"use client";

export type Segment<T extends string> = {
  value: T;
  label: string;
};

/**
 * SegmentedToggle — proper segmented-control pattern. card-2 track,
 * white active pill with soft shadow, ink-3 inactive labels with
 * hover-darken.
 */
export function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: readonly Segment<T>[];
  onChange: (v: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center bg-card-2 p-0.5 border border-line"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`px-3 h-7 text-[12px] font-bold tracking-wide ${
              active
                ? "bg-card text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                : "text-ink-3 hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
