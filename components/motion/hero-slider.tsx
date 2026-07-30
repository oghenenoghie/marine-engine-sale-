"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import "keen-slider/keen-slider.min.css";

const AUTOPLAY_MS = 6000;

/**
 * Background slider for the homepage hero — admin-uploaded photos
 * (lib/data/settings.ts / components/admin/hero-image-uploader.tsx),
 * autoplaying with pagination dots. Renders only the slides + dots;
 * the dark overlay, tech-grid and hero copy stay in the callers
 * (app/(site)/page.tsx and the admin preview) so both stay pixel-identical.
 */
export function HeroSlider({ images, className }: { images: string[]; className?: string }) {
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: images.length > 1,
    slideChanged(slider) {
      setCurrent(slider.track.details.rel);
    },
  });

  useEffect(() => {
    if (reduceMotion || images.length < 2) return;
    const id = setInterval(() => instanceRef.current?.next(), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [instanceRef, reduceMotion, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      {/* keen-slider's own stylesheet sets position:relative on .keen-slider
          with higher specificity than Tailwind's .absolute, so the
          absolute-positioning + sizing lives on this wrapper instead. */}
      <div className={cn("absolute inset-0", className)}>
        <div ref={sliderRef} className="keen-slider h-full w-full">
          {images.map((url, i) => (
            <div key={url} className="keen-slider__slide">
              <Image src={url} alt="" fill unoptimized priority={i === 0} className="object-cover" aria-hidden />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div
          role="tablist"
          aria-label="Hero image slides"
          className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-1.5"
        >
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => instanceRef.current?.moveToIdx(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-200",
                i === current ? "w-6 bg-paper" : "w-1.5 bg-paper/40 hover:bg-paper/70",
              )}
            />
          ))}
        </div>
      )}
    </>
  );
}
