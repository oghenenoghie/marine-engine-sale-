"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CategorySlider({
  items,
  interval = 2200,
  className,
}: {
  items: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [items.length, interval]);

  return (
    <>
      <span className={cn("relative inline-block h-[1.4em] overflow-hidden align-bottom", className)} aria-hidden="true">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={items[index]}
            initial={reduceMotion ? undefined : { y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={reduceMotion ? undefined : { y: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="block whitespace-nowrap"
          >
            {items[index]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only">{items.join(", ")}</span>
    </>
  );
}
