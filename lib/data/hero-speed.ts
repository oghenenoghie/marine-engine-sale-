/**
 * Seconds each homepage hero slide stays up before autoplay moves on —
 * admin-set via components/admin/hero-slide-speed.tsx and stored in
 * site_settings (key: hero_slide_interval, read by getHeroSlideInterval()).
 * Kept free of server imports so the client control can share the limits.
 */
export const SLIDE_INTERVAL_MIN = 2;
export const SLIDE_INTERVAL_MAX = 30;
export const DEFAULT_SLIDE_INTERVAL = 4;

/** Coerces any stored/typed value into the allowed range, in half-second steps; unusable input → the default. */
export function clampSlideInterval(value: unknown): number {
  const n = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
  if (!Number.isFinite(n)) return DEFAULT_SLIDE_INTERVAL;
  return Math.min(SLIDE_INTERVAL_MAX, Math.max(SLIDE_INTERVAL_MIN, Math.round(n * 2) / 2));
}
