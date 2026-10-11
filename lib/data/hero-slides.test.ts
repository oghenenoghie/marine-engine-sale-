import { describe, expect, it } from "vitest";
import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_SLIDE_INTERVAL,
  SLIDE_INTERVAL_MAX,
  SLIDE_INTERVAL_MIN,
  parseHeroSlider,
  validateHeroSlider,
  type HeroSlide,
} from "./hero-slides";

const slide = (overrides: Partial<HeroSlide> = {}): HeroSlide => ({
  id: "a",
  label: "Barges",
  eyebrow: "Rental fleet",
  headline: "Heavy cargo, open deck.",
  body: "Copy.",
  primary: { label: "View barges", href: "/rentals/barges" },
  secondary: { label: "", href: "" },
  ...overrides,
});

describe("parseHeroSlider", () => {
  it("falls back to the default slides and speed for missing or malformed data", () => {
    expect(parseHeroSlider(null)).toEqual({ intervalSeconds: DEFAULT_SLIDE_INTERVAL, slides: DEFAULT_HERO_SLIDES });
    expect(parseHeroSlider({ slides: "nope", intervalSeconds: "fast" }).slides).toBe(DEFAULT_HERO_SLIDES);
  });

  it("drops slides without a headline or main button, and strips unsafe links and images", () => {
    const parsed = parseHeroSlider({
      intervalSeconds: 3,
      slides: [
        slide({ headline: "" }),
        slide({
          id: "ok",
          label: "",
          secondary: { label: "Bad", href: "javascript:alert(1)" },
          image: "//evil.example/x.png",
        }),
      ],
    });

    expect(parsed.intervalSeconds).toBe(3);
    expect(parsed.slides).toHaveLength(1);
    expect(parsed.slides[0]).toMatchObject({ id: "ok", label: "Heavy cargo, open deck.", secondary: { href: "" } });
    expect(parsed.slides[0]!.image).toBeUndefined();
  });

  it("clamps the speed and de-duplicates slide ids", () => {
    const parsed = parseHeroSlider({ intervalSeconds: 0.2, slides: [slide(), slide()] });
    expect(parsed.intervalSeconds).toBe(SLIDE_INTERVAL_MIN);
    expect(new Set(parsed.slides.map((s) => s.id)).size).toBe(2);
    expect(parseHeroSlider({ intervalSeconds: 999, slides: [slide()] }).intervalSeconds).toBe(SLIDE_INTERVAL_MAX);
  });
});

describe("validateHeroSlider", () => {
  it("accepts a valid slider and trims its text", () => {
    const result = validateHeroSlider({ intervalSeconds: 4, slides: [slide({ headline: "  Trimmed.  " })] });
    expect(result.ok && result.value.slides[0]!.headline).toBe("Trimmed.");
  });

  it.each([
    [{ intervalSeconds: 4, slides: [] }, "Add at least one slide."],
    [{ intervalSeconds: 1, slides: [slide()] }, "Slide duration must be between"],
    [{ intervalSeconds: 4, slides: [slide({ headline: " " })] }, "Slide 1: headline is required."],
    [{ intervalSeconds: 4, slides: [slide({ primary: { label: "Go", href: "" } })] }, "main button needs both"],
    [{ intervalSeconds: 4, slides: [slide({ primary: { label: "Go", href: "javascript:alert(1)" } })] }, "main button link must start"],
    [{ intervalSeconds: 4, slides: [slide({ secondary: { label: "Call", href: "" } })] }, "second button has a label but no link"],
    [{ intervalSeconds: 4, slides: [slide({ image: "http://insecure.example/a.png" })] }, "drawing must be"],
  ])("rejects %j", (input, message) => {
    const result = validateHeroSlider(input);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toContain(message);
  });
});
