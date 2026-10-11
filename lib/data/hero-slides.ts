import { RENTAL_CATEGORIES } from "@/lib/data/rentals";

/**
 * Homepage hero carousel content (components/common/fleet-hero-slider.tsx).
 * Admin-editable via components/admin/hero-slider-editor.tsx and stored as
 * one JSON row in site_settings (key: hero_slider — see lib/data/settings.ts
 * getHeroSlider()). Kept free of server imports so the admin editor (a client
 * component) can share the types, defaults and validation.
 *
 * With no saved row the hero uses DEFAULT_HERO_SLIDER, which is derived from
 * lib/data/rentals.ts: the fleet-wide charter slide, then one slide per rental
 * line that has both an `image` and a `tagline`.
 */

export interface HeroSlideLink {
  label: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  /** Names the slide in the pagination buttons and the caption under the controls. */
  label: string;
  eyebrow: string;
  headline: string;
  body: string;
  primary: HeroSlideLink;
  /** Optional second button — hidden when its label or link is empty. */
  secondary: HeroSlideLink;
  /** Paper-on-transparent drawing (path under /public or an uploaded URL); empty → the animated line drawing. */
  image?: string;
}

export interface HeroSliderSettings {
  /** Seconds each slide stays up before autoplay moves on. */
  intervalSeconds: number;
  slides: HeroSlide[];
}

export const SLIDE_INTERVAL_MIN = 2;
export const SLIDE_INTERVAL_MAX = 30;
export const DEFAULT_SLIDE_INTERVAL = 4;
export const MAX_HERO_SLIDES = 10;

const firstSentence = (text: string) => text.match(/^.*?\.(?=\s|$)/)?.[0] ?? text;

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "fleet",
    label: "Rental fleet",
    eyebrow: "Marine rental · vessel & equipment charter",
    headline: "Charter without limits.",
    body: "Specialized vessels and marine equipment for offshore operations, intervention, construction and heavy logistics — tell us the dates and job, and we'll come back with availability.",
    primary: { label: "Browse rental fleet", href: "/rentals#fleet" },
    secondary: { label: "Request availability", href: "/contact" },
  },
  ...RENTAL_CATEGORIES.flatMap((category) =>
    category.image && category.tagline
      ? [
          {
            id: category.slug,
            label: category.label,
            eyebrow: `Rental fleet · ${category.label}`,
            headline: category.tagline,
            body: firstSentence(category.description),
            primary: { label: `View ${category.label.toLowerCase()}`, href: `/rentals/${category.slug}` },
            secondary: { label: "Request availability", href: `/rentals/${category.slug}#request-availability` },
            image: category.image,
          },
        ]
      : [],
  ),
];

export const DEFAULT_HERO_SLIDER: HeroSliderSettings = {
  intervalSeconds: DEFAULT_SLIDE_INTERVAL,
  slides: DEFAULT_HERO_SLIDES,
};

/** Drawings the editor offers out of the box — every rental line that has one. */
export const BUILT_IN_SLIDE_DRAWINGS: { label: string; src: string }[] = RENTAL_CATEGORIES.flatMap((category) =>
  category.image ? [{ label: category.label, src: category.image }] : [],
);

// Site-relative paths, in-page anchors and absolute web/mail/phone links only — never javascript: etc.
const SAFE_HREF = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i;
// Images are /public paths or uploaded (https) Supabase Storage URLs.
const SAFE_IMAGE = /^(\/(?!\/)|https:\/\/)/i;

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

function cleanLink(value: unknown): HeroSlideLink {
  const link = (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>;
  const href = text(link.href);
  return { label: text(link.label), href: SAFE_HREF.test(href) ? href : "" };
}

function cleanSlide(value: unknown, index: number): HeroSlide {
  const raw = (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>;
  const headline = text(raw.headline);
  const image = text(raw.image);
  return {
    id: text(raw.id) || `slide-${index + 1}`,
    label: text(raw.label) || headline,
    eyebrow: text(raw.eyebrow),
    headline,
    body: text(raw.body),
    primary: cleanLink(raw.primary),
    secondary: cleanLink(raw.secondary),
    ...(image && SAFE_IMAGE.test(image) ? { image } : {}),
  };
}

function clampInterval(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return DEFAULT_SLIDE_INTERVAL;
  return Math.min(SLIDE_INTERVAL_MAX, Math.max(SLIDE_INTERVAL_MIN, Math.round(n * 2) / 2));
}

function withUniqueIds(slides: HeroSlide[]): HeroSlide[] {
  const seen = new Set<string>();
  return slides.map((slide, i) => {
    const id = seen.has(slide.id) ? `${slide.id}-${i + 1}` : slide.id;
    seen.add(id);
    return { ...slide, id };
  });
}

/**
 * Lenient read of a stored (untrusted-shape) value: drops slides without a
 * headline or primary button, and falls back to the defaults when nothing
 * usable is left — the hero must always have at least one slide.
 */
export function parseHeroSlider(raw: unknown): HeroSliderSettings {
  const obj = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const slides = (Array.isArray(obj.slides) ? obj.slides : [])
    .slice(0, MAX_HERO_SLIDES)
    .map(cleanSlide)
    .filter((s) => s.headline && s.primary.label && s.primary.href);
  return {
    intervalSeconds: clampInterval(obj.intervalSeconds),
    slides: slides.length > 0 ? withUniqueIds(slides) : DEFAULT_HERO_SLIDES,
  };
}

/** Strict check for saving from the admin editor — names the first problem instead of silently dropping it. */
export function validateHeroSlider(
  input: HeroSliderSettings,
): { ok: true; value: HeroSliderSettings } | { ok: false; error: string } {
  if (!Array.isArray(input.slides) || input.slides.length === 0) return { ok: false, error: "Add at least one slide." };
  if (input.slides.length > MAX_HERO_SLIDES) return { ok: false, error: `Use at most ${MAX_HERO_SLIDES} slides.` };
  const interval = Number(input.intervalSeconds);
  if (!Number.isFinite(interval) || interval < SLIDE_INTERVAL_MIN || interval > SLIDE_INTERVAL_MAX) {
    return { ok: false, error: `Slide duration must be between ${SLIDE_INTERVAL_MIN} and ${SLIDE_INTERVAL_MAX} seconds.` };
  }

  for (const [i, slide] of input.slides.entries()) {
    const n = `Slide ${i + 1}`;
    if (!text(slide.headline)) return { ok: false, error: `${n}: headline is required.` };
    if (!text(slide.primary?.label) || !text(slide.primary?.href)) {
      return { ok: false, error: `${n}: the main button needs both a label and a link.` };
    }
    for (const [name, link] of [["main", slide.primary], ["second", slide.secondary]] as const) {
      const href = text(link?.href);
      if (href && !SAFE_HREF.test(href)) {
        return { ok: false, error: `${n}: the ${name} button link must start with /, #, https://, mailto: or tel:.` };
      }
    }
    if (text(slide.secondary?.label) !== "" && text(slide.secondary?.href) === "") {
      return { ok: false, error: `${n}: the second button has a label but no link.` };
    }
    const image = text(slide.image);
    if (image && !SAFE_IMAGE.test(image)) return { ok: false, error: `${n}: the drawing must be a site path or an https URL.` };
  }

  return { ok: true, value: { intervalSeconds: clampInterval(interval), slides: withUniqueIds(input.slides.map(cleanSlide)) } };
}
