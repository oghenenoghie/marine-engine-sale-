"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { HeroDrawing } from "@/lib/data/settings";

const CYCLE_MS = 6000;

/**
 * Cross-fades through the admin-editable homepage hero technical drawings
 * (lib/data/settings.ts getHeroDrawings(), edited via
 * components/admin/hero-drawings-uploader.tsx), each with its caption. A
 * single drawing just sits static. Respects prefers-reduced-motion by
 * disabling the auto-cycle and crossfade, matching the rest of
 * components/motion/'s reduced-motion convention.
 */
export function HeroDrawingCycle({ drawings }: { drawings: HeroDrawing[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || drawings.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % drawings.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [reduceMotion, drawings.length]);

  const current = drawings[index] ?? drawings[0];
  if (!current) return null;

  return (
    <div className="w-[85%] lg:w-full">
      <div className="relative aspect-[1794/877] w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.url}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={current.url}
              alt=""
              fill
              unoptimized
              priority={index === 0}
              className="object-contain opacity-80 mix-blend-luminosity"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {current.caption && (
        <p className="mt-2 text-right font-mono text-[10px] uppercase tracking-wider text-paper/40 lg:text-[11px]">
          {current.caption}
        </p>
      )}
    </div>
  );
}
