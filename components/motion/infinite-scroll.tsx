"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const SPEEDS = { slow: "55s", normal: "36s", fast: "22s" } as const;

/**
 * Horizontal marquee: `children` (each already keyed by the caller) is
 * rendered twice back-to-back and animated by -50%, so the loop reads as
 * continuous. Takes pre-rendered children rather than a render-prop, since
 * functions can't cross the Server->Client Component boundary. Duration/
 * direction are set as CSS custom properties on the container, which the
 * animation (defined in tailwind.config.ts) reads via var() — lets one
 * keyframe serve every speed/direction combo. Falls back to a plain
 * scrollable row when the user prefers reduced motion.
 */
export function InfiniteScroll({
  children,
  speed = "normal",
  direction = "left",
  className,
}: {
  children: ReactNode;
  speed?: keyof typeof SPEEDS;
  direction?: "left" | "right";
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (reduceMotion || !containerRef.current) return;
    containerRef.current.style.setProperty("--scroll-duration", SPEEDS[speed]);
    containerRef.current.style.setProperty("--scroll-direction", direction === "left" ? "forwards" : "reverse");
    setAnimating(true);
  }, [reduceMotion, speed, direction]);

  const original = Children.toArray(children);
  const doubled = reduceMotion
    ? original
    : [...original, ...original.map((child, i) => (isValidElement(child) ? cloneElement(child, { key: `dup-${i}` }) : child))];

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        reduceMotion && "overflow-x-auto",
        className,
      )}
    >
      <ul
        className={cn(
          "flex w-max flex-nowrap items-stretch gap-4",
          animating && "animate-infinite-scroll hover:[animation-play-state:paused]",
        )}
      >
        {doubled.map((child, i) => (
          <li key={i} className="shrink-0" aria-hidden={i >= original.length || undefined}>
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
}
