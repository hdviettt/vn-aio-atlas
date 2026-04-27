"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

export type SelectOption = {
  value: string;
  label: string;
};

/**
 * Select — replaces native <select>. Custom dropdown with proper
 * styling, keyboard support (Esc to close, click-outside-to-close),
 * smooth transitions, full ARIA.
 */
export function Select({
  value,
  options,
  onChange,
  placeholder,
  ariaLabel,
}: {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleKey);
      return () => {
        document.removeEventListener("mousedown", handleClick);
        document.removeEventListener("keydown", handleKey);
      };
    }
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="w-full inline-flex items-center justify-between gap-2 h-9 px-3 text-sm font-medium text-ink bg-card border border-line hover:border-line-strong active:bg-card-2"
      >
        <span className="truncate">{current?.label ?? placeholder ?? "Select"}</span>
        <Icon
          name={ChevronDown}
          size={14}
          className={`flex-shrink-0 text-ink-3 transition-transform duration-[var(--motion-fast)] ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute z-30 mt-1 w-full max-h-64 overflow-y-auto bg-card border border-line shadow-[0_4px_16px_rgba(0,0,0,0.06)] animate-fade-in-up"
        >
          {options.map((opt) => {
            const selected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 h-8 text-sm flex items-center ${
                  selected
                    ? "bg-accent-tint text-accent font-semibold"
                    : "text-ink-2 hover:bg-card-2 hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
