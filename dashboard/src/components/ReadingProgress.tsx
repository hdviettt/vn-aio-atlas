"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/**
 * ReadingProgress — thin scroll-progress bar fixed to the viewport top
 * plus a back-to-top affordance that fades in after the reader has
 * scrolled past the hero. Both hide in print.
 */
export function ReadingProgress({ label }: { label: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct =
        docHeight > 0 ? Math.min(100, (scrolled / docHeight) * 100) : 0;
      setProgress(pct);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showBackToTop = progress > 8;

  return (
    <>
      {/* Hairline progress bar at the top of the viewport */}
      <div
        className="fixed top-0 left-0 right-0 h-px z-50 bg-transparent print:hidden"
        aria-hidden="true"
      >
        <div
          className="h-full bg-accent"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Back-to-top button — fades in after the reader leaves the hero */}
      <button
        type="button"
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        aria-label={label}
        className={`fixed bottom-6 right-6 z-40 h-10 w-10 inline-flex items-center justify-center bg-card border border-line-strong text-ink-2 hover:text-accent hover:border-accent shadow-[0_1px_2px_rgba(0,0,0,0.06)] print:hidden ${
          showBackToTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
        style={{
          transitionProperty: "opacity, transform, color, border-color",
          transitionDuration: "200ms",
          transitionTimingFunction: "var(--motion-ease)",
        }}
      >
        <Icon name={ArrowUp} size={16} />
      </button>
    </>
  );
}
