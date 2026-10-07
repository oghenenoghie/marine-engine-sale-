"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Technical line drawing of a support vessel (hull, deckhouses, mast),
 * drawn in via stroke-dashoffset. Used on the rentals hero as the
 * "one orchestrated moment" for that page, mirroring <DrawingReveal>
 * on the homepage hero but with a vessel silhouette instead of a
 * cylinder cross-section.
 */
export function VesselReveal({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  const line = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { delay: i * 0.12, duration: 1, ease: [0.65, 0, 0.35, 1] }, opacity: { delay: i * 0.12, duration: 0.3 } },
    }),
  };

  return (
    <svg
      viewBox="0 0 700 360"
      fill="none"
      className={className}
      role="img"
      aria-label="Technical line drawing of a marine support vessel"
    >
      {/* Hull */}
      <motion.path
        d="M30,290 L110,255 L600,255 L650,285 L650,305 L55,305 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        custom={0}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={line}
      />
      {/* Hull waterline striping */}
      {[272, 282, 292].map((y, i) => (
        <motion.line
          key={y}
          x1={70 + i * 10}
          y1={y}
          x2={620 - i * 8}
          y2={y}
          stroke="currentColor"
          strokeWidth="1"
          custom={0.3 + i * 0.05}
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "visible"}
          variants={line}
        />
      ))}
      {/* Fore deckhouse */}
      <motion.rect
        x="165"
        y="210"
        width="85"
        height="45"
        stroke="currentColor"
        strokeWidth="1.5"
        custom={1}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={line}
      />
      {/* Midships deckhouse (trapezoid) */}
      <motion.path
        d="M275,255 L290,175 L400,175 L415,255 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        custom={1.3}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={line}
      />
      {/* Aft tower */}
      <motion.rect
        x="450"
        y="120"
        width="75"
        height="135"
        stroke="currentColor"
        strokeWidth="1.5"
        custom={1.6}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={line}
      />
      {/* Mast / crane */}
      <motion.path
        d="M555,255 L600,70 L645,160"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        custom={2}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={line}
      />
      <motion.line
        x1="600"
        y1="70"
        x2="600"
        y2="40"
        stroke="currentColor"
        strokeWidth="1"
        custom={2.2}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={line}
      />
      {/* Waterline */}
      <motion.path
        d="M0,320 Q35,310 70,320 T140,320 T210,320 T280,320 T350,320 T420,320 T490,320 T560,320 T630,320 T700,320"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 4"
        custom={2.4}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={line}
      />
    </svg>
  );
}
