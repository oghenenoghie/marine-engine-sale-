"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => v / 16));

const DOT_COLORS = ["#2E6E9E", "#C6602B", "#6E8B7B"]; // blueprint, signal, patina
const CELL = 9;
const FRAME_INTERVAL = 1000 / 24;

/**
 * Animated ordered-dither grain — a hand-built equivalent of Aceternity's
 * dither-background hero effect, tuned to the Drydock palette. Runs a fixed
 * frame rate rather than every rAF tick to keep it cheap as a hero backdrop.
 */
export function DitherCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = width;
      canvas.height = height;
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const render = (elapsedSeconds: number) => {
      ctx.clearRect(0, 0, width, height);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = x / cols;
          const ny = y / rows;
          const wave =
            Math.sin(nx * 9 + elapsedSeconds * 0.5) * Math.cos(ny * 9 - elapsedSeconds * 0.35) * 0.5 + 0.5;
          const threshold = BAYER_4X4[y % 4]![x % 4]!;
          if (wave > threshold) {
            ctx.globalAlpha = 0.05 + wave * 0.12;
            ctx.fillStyle = DOT_COLORS[(x + y) % DOT_COLORS.length]!;
            ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    if (reduceMotion) {
      render(0);
      return () => ro.disconnect();
    }

    let raf = 0;
    let start: number | null = null;
    let last = 0;
    const tick = (t: number) => {
      if (start === null) start = t;
      if (t - last >= FRAME_INTERVAL) {
        render((t - start) / 1000);
        last = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("block", className)} />;
}
