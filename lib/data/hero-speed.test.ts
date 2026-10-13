import { describe, expect, it } from "vitest";
import { DEFAULT_SLIDE_INTERVAL, SLIDE_INTERVAL_MAX, SLIDE_INTERVAL_MIN, clampSlideInterval } from "./hero-speed";

describe("clampSlideInterval", () => {
  it("keeps in-range values, rounded to half seconds", () => {
    expect(clampSlideInterval(3)).toBe(3);
    expect(clampSlideInterval("5.3")).toBe(5.5);
  });

  it("clamps to the allowed range", () => {
    expect(clampSlideInterval(0.5)).toBe(SLIDE_INTERVAL_MIN);
    expect(clampSlideInterval(120)).toBe(SLIDE_INTERVAL_MAX);
  });

  it("falls back to the default for unusable input", () => {
    for (const bad of [null, undefined, "", "fast", Number.NaN, {}]) {
      expect(clampSlideInterval(bad)).toBe(DEFAULT_SLIDE_INTERVAL);
    }
  });
});
