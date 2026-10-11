"use client";

import { useState, type FocusEvent, type KeyboardEvent, type ReactNode, type TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { VesselReveal } from "@/components/motion/vessel-reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FleetHeroSlide {
  id: string;
  /** Names the slide for the pagination buttons. */
  label: string;
  eyebrow: string;
  headline: string;
  body: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  /** Dimmed full-bleed backdrop behind this slide only. Omit for just the tech-grid backdrop. */
  backgroundImage?: string;
  /** Technical line drawing on the right, with an optional caption. Omit for the animated <VesselReveal/> placeholder. */
  drawing?: { url: string; caption?: string };
}

const EASE = [0.22, 1, 0.36, 1] as const;
const SWIPE_PX = 50;

/**
 * Homepage hero as a single carousel: every slide is fully self-contained
 * (eyebrow, headline, copy, CTAs, its own optional background photo and
 * technical drawing) over one shared hull/tech-grid backdrop. Slides
 * cross-fade in place, stacked in one grid cell so the hero never changes
 * height between them.
 *
 * Autoplay is driven by the active pagination bar's CSS fill animation
 * (animationend → next slide), so pausing it pauses the timer too. It pauses
 * on hover, keyboard focus and the explicit pause button, and is off entirely
 * under prefers-reduced-motion. `children` renders bottom-left (the stats row).
 */
export function FleetHeroSlider({
  slides,
  children,
}: {
  slides: FleetHeroSlide[];
  children?: ReactNode;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);

  const count = slides.length;
  const multiple = count > 1;
  const autoplay = multiple && !reduceMotion && !userPaused;
  const playing = autoplay && !hovered && !focused;
  const current = slides[index] ?? slides[0];

  const goTo = (i: number) => setIndex(((i % count) + count) % count);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const onFocus = (e: FocusEvent<HTMLElement>) => {
    // Keyboard focus only — a mouse click on a control shouldn't leave the carousel stuck paused.
    let keyboard = true;
    try {
      keyboard = e.target.matches(":focus-visible");
    } catch {
      // Selector unsupported (older engines/jsdom) — treat as keyboard focus, the safer default.
    }
    if (keyboard) setFocused(true);
  };
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };
  const onTouchStart = (e: TouchEvent<HTMLElement>) => setTouchX(e.touches[0]?.clientX ?? null);
  const onTouchEnd = (e: TouchEvent<HTMLElement>) => {
    const endX = e.changedTouches[0]?.clientX;
    if (touchX !== null && endX !== undefined && Math.abs(endX - touchX) > SWIPE_PX) {
      if (endX < touchX) next();
      else prev();
    }
    setTouchX(null);
  };
  const onControlsKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  };

  if (!current) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Rental fleet"
      className="relative isolate overflow-hidden bg-hull text-paper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={onFocus}
      onBlur={onBlur}
      onTouchStart={multiple ? onTouchStart : undefined}
      onTouchEnd={multiple ? onTouchEnd : undefined}
    >
      {/* Background photos — one dimmed layer per slide, cross-faded with the active slide */}
      {slides.some((slide) => slide.backgroundImage) && (
        <>
          <div className="absolute inset-0" aria-hidden>
            {slides.map(
              (slide, i) =>
                slide.backgroundImage && (
                  <motion.div
                    key={slide.id}
                    initial={false}
                    animate={{ opacity: i === index ? 0.5 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.9, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <Image src={slide.backgroundImage} alt="" fill unoptimized className="object-cover" />
                  </motion.div>
                ),
            )}
          </div>
          <div className="absolute inset-0 bg-hull/60" aria-hidden />
        </>
      )}
      <div
        className="tech-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_30%_40%,black,transparent)]"
        aria-hidden
      />

      {/* Drawings — one layer per slide, cross-faded */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 overflow-hidden opacity-30 sm:h-56 lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[55%] lg:opacity-100"
        aria-hidden
      >
        {slides.map((slide, i) => (
          <motion.div
            key={slide.id}
            initial={false}
            animate={i === index ? { opacity: 1, scale: 1 } : { opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, ease: EASE }}
            className="absolute inset-0 flex items-end justify-end lg:items-center lg:justify-center"
          >
            {slide.drawing ? (
              <div className="relative h-full w-[85%] lg:aspect-[3/2] lg:h-auto lg:w-full lg:opacity-60">
                <Image src={slide.drawing.url} alt="" fill unoptimized className="object-contain object-bottom lg:object-center" />
                {slide.drawing.caption && (
                  <p className="absolute inset-x-0 bottom-1 text-right font-mono text-[10px] uppercase tracking-wider text-paper/50">
                    {slide.drawing.caption}
                  </p>
                )}
              </div>
            ) : (
              <VesselReveal className="w-[85%] text-paper/25 lg:w-full" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:py-20">
        {/* Copy — every slide occupies the same grid cell, so the tallest sets the height */}
        <FadeIn className="max-w-xl">
          <div className="grid" aria-live={playing ? "off" : "polite"}>
            {slides.map((slide, i) => {
              const active = i === index;
              const Heading = i === 0 ? "h1" : "h2";
              return (
                <motion.div
                  key={slide.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}: ${slide.label}`}
                  aria-hidden={!active}
                  initial={false}
                  animate={
                    active
                      ? { opacity: 1, y: 0, visibility: "visible" }
                      : { opacity: 0, y: reduceMotion ? 0 : 8, transitionEnd: { visibility: "hidden" } }
                  }
                  transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE, delay: active && !reduceMotion ? 0.15 : 0 }}
                  className="[grid-area:1/1]"
                >
                  <span className="label inline-flex items-center gap-2 border border-paper/20 px-4 py-1.5 text-paper/80">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-paper" aria-hidden />
                    {slide.eyebrow}
                  </span>
                  <Heading className="mt-5 text-display-xl font-display font-extrabold uppercase leading-[0.95] tracking-tight">
                    {slide.headline}
                  </Heading>
                  <p className="mt-5 max-w-[50ch] text-[13px] leading-relaxed text-paper/70">{slide.body}</p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Button asChild variant="inverse" size="lg">
                      <Link href={slide.primary.href}>
                        {slide.primary.label} <ArrowRight size={16} />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-paper/25 text-paper hover:bg-paper/10">
                      <Link href={slide.secondary.href}>{slide.secondary.label}</Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </FadeIn>

        <div className="mt-16 flex flex-col gap-10 sm:mt-24 sm:flex-row sm:items-end sm:justify-between">
          {children}

          {multiple && (
            <div className="flex flex-col items-start gap-3 sm:items-end" onKeyDown={onControlsKeyDown}>
              <p className="font-mono text-[11px] uppercase tracking-wider text-paper/50">{current.label}</p>
              <div className="flex items-center gap-4">
                {/* Arrows lead on mobile so the floating WhatsApp button never covers them */}
                <div className="order-2 flex items-center gap-1 sm:order-1">
                  {slides.map((slide, i) => {
                    const active = i === index;
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        aria-label={`Show slide ${i + 1}: ${slide.label}`}
                        aria-current={active ? "true" : undefined}
                        onClick={() => goTo(i)}
                        className={cn(
                          "group flex h-8 items-center rounded-sm transition-[width] duration-300 focus-visible:ring-paper focus-visible:ring-offset-hull",
                          active ? "w-12 sm:w-14" : "w-6 sm:w-8",
                        )}
                      >
                        <span className="relative h-0.5 w-full overflow-hidden bg-paper/20 transition-colors duration-200 group-hover:bg-paper/40">
                          <span
                            className={cn(
                              "absolute inset-0 origin-left bg-paper",
                              !active && "scale-x-0",
                              active && (reduceMotion ? "scale-x-100" : "animate-slide-progress"),
                            )}
                            style={active && !reduceMotion ? { animationPlayState: playing ? "running" : "paused" } : undefined}
                            onAnimationEnd={active ? next : undefined}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="order-1 flex items-center gap-1 sm:order-2">
                  <ControlButton label="Previous slide" onClick={prev}>
                    <ChevronLeft size={14} />
                  </ControlButton>
                  {!reduceMotion && (
                    <ControlButton
                      label={userPaused ? "Start slide rotation" : "Pause slide rotation"}
                      onClick={() => setUserPaused((p) => !p)}
                    >
                      {userPaused ? <Play size={12} /> : <Pause size={12} />}
                    </ControlButton>
                  )}
                  <ControlButton label="Next slide" onClick={next}>
                    <ChevronRight size={14} />
                  </ControlButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-paper/20 text-paper/70 transition-colors duration-200 hover:border-paper/50 hover:text-paper focus-visible:ring-paper focus-visible:ring-offset-hull"
    >
      {children}
    </button>
  );
}
