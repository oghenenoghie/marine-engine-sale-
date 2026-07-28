"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SliderCategory {
  label: string;
  href: string;
}

/**
 * Horizontal slider of business-line shortcuts for the hero. Native
 * scroll-snap + a ref-driven scrollBy for the arrow controls, rather than a
 * carousel library — keeps it swipeable on touch and free of layout shift.
 */
export function CategorySlider({ categories, className }: { categories: SliderCategory[]; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-slide]");
    const step = (card?.offsetWidth ?? 160) + 12;
    track.scrollBy({ left: direction * step * 3, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth sm:mx-10"
      >
        {categories.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            data-slide
            className="group flex shrink-0 snap-start items-center gap-2 whitespace-nowrap border border-paper/20 px-4 py-2.5 text-[13px] font-medium text-paper/80 transition-colors duration-200 hover:border-paper hover:bg-paper hover:text-hull"
          >
            {c.label}
            <ArrowRight size={13} className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Scroll categories left"
        className="absolute left-0 top-1/2 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-paper/25 bg-hull text-paper transition-colors hover:border-paper hover:bg-paper hover:text-hull sm:grid"
      >
        <ArrowLeft size={14} />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Scroll categories right"
        className="absolute right-0 top-1/2 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-paper/25 bg-hull text-paper transition-colors hover:border-paper hover:bg-paper hover:text-hull sm:grid"
      >
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
