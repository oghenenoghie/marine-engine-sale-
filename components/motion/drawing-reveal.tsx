"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The hero's "one orchestrated moment": an abstract cross-section of a
 * cylinder unit, drawn in via stroke-dashoffset. Purely decorative — the
 * real signature feature is <ExplodedDrawing> with live hotspots.
 */
export function DrawingReveal({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  const line = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { delay: i * 0.15, duration: 1.1, ease: [0.65, 0, 0.35, 1] }, opacity: { delay: i * 0.15, duration: 0.3 } },
    }),
  };

  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      className={className}
      role="img"
      aria-label="Technical line drawing of a marine cylinder unit"
    >
      <motion.rect
        x="140"
        y="40"
        width="200"
        height="90"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
        custom={0}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={line}
      />
      <motion.line
        x1="170"
        y1="130"
        x2="170"
        y2="360"
        stroke="currentColor"
        strokeWidth="1.5"
        custom={1}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={line}
      />
      <motion.line
        x1="310"
        y1="130"
        x2="310"
        y2="360"
        stroke="currentColor"
        strokeWidth="1.5"
        custom={1}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={line}
      />
      <motion.rect
        x="170"
        y="360"
        width="140"
        height="60"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
        custom={2}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={line}
      />
      <motion.circle
        cx="240"
        cy="245"
        r="55"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        custom={3}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={line}
      />
      {[0, 90, 180, 270].map((deg, i) => (
        <motion.line
          key={deg}
          x1="240"
          y1="245"
          x2={240 + 55 * Math.cos((deg * Math.PI) / 180)}
          y2={245 + 55 * Math.sin((deg * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="1"
          custom={3.2 + i * 0.05}
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "visible"}
          variants={line}
        />
      ))}
    </svg>
  );
}
