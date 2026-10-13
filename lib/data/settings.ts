import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/server";
import { DEFAULT_SLIDE_INTERVAL, clampSlideInterval } from "@/lib/data/hero-speed";

/**
 * Small admin-editable site content that doesn't warrant its own table —
 * see supabase/migrations/0006_site_settings.sql. RLS: public read, admin
 * write via lib/actions/settings.ts. No seed fallback: unlike taxonomy/stock
 * this is optional decoration, so an unreachable/unconfigured Supabase
 * project just means default hero content rather than a page that needs to
 * degrade.
 *
 * The homepage hero is one carousel (components/common/fleet-hero-slider.tsx)
 * and each slide is a single self-contained unit — eyebrow/headline/body,
 * both CTAs, an optional background photo, and an optional technical
 * drawing + caption. Admins manage the full ordered list (add/remove/reorder)
 * via components/admin/hero-slides-editor.tsx; the list is stored as one
 * JSON-encoded array in the `value` text column (key: hero_slides). Rental
 * category slides (app/(site)/page.tsx RENTAL_SLIDES) are appended after
 * these at render time — they come from lib/data/rentals.ts, not this table.
 */
export type HeroSlide = {
  id: string;
  eyebrow: string;
  headline: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  /** Supabase Storage public URL, or "" for no background photo (just the tech-grid backdrop). */
  backgroundImage: string;
  /** Supabase Storage public URL, or "" to fall back to the animated <VesselReveal/> placeholder. */
  drawingUrl: string;
  drawingCaption: string;
};

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "fleet",
    eyebrow: "Marine diesel · engines & parts",
    headline: "Trading the fleet — engines, parts and power, across every major brand.",
    body: "Shipcove Trading trades complete marine diesel engines and spare parts across Wärtsilä, MAN, MaK, Deutz and Caterpillar — searchable by OEM number, by model, and through interactive exploded diagrams that link straight to live stock.",
    primaryHref: "/parts",
    primaryLabel: "Browse parts",
    secondaryHref: "/rentals#fleet",
    secondaryLabel: "Browse rental fleet",
    backgroundImage: "",
    drawingUrl: "/hero/well-intervention-vessel.png",
    drawingCaption: "Light well intervention vessel — technical line drawing",
  },
];

const HERO_SLIDES_KEY = "hero_slides";

const asHeroSlide = (v: unknown): HeroSlide | null => {
  if (typeof v !== "object" || v === null) return null;
  const d = v as Record<string, unknown>;
  const str = (k: string) => (typeof d[k] === "string" ? (d[k] as string) : "");
  if (!str("eyebrow") || !str("headline") || !str("body") || !str("primaryHref") || !str("primaryLabel") || !str("secondaryHref") || !str("secondaryLabel")) {
    return null;
  }
  return {
    id: str("id") || crypto.randomUUID(),
    eyebrow: str("eyebrow"),
    headline: str("headline"),
    body: str("body"),
    primaryHref: str("primaryHref"),
    primaryLabel: str("primaryLabel"),
    secondaryHref: str("secondaryHref"),
    secondaryLabel: str("secondaryLabel"),
    backgroundImage: str("backgroundImage"),
    drawingUrl: str("drawingUrl"),
    drawingCaption: str("drawingCaption"),
  };
};

export const getHeroSlides = cache(async (): Promise<HeroSlide[]> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", HERO_SLIDES_KEY).maybeSingle();
    if (error) throw new Error(`getHeroSlides: ${error.message}`);
    if (!data?.value) return DEFAULT_HERO_SLIDES;
    const parsed = JSON.parse(data.value);
    if (!Array.isArray(parsed)) return DEFAULT_HERO_SLIDES;
    const slides = parsed.map(asHeroSlide).filter((s): s is HeroSlide => s !== null);
    return slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;
  } catch (err) {
    console.warn("[lib/data/settings] getHeroSlides falling back to default slides:", err);
    return DEFAULT_HERO_SLIDES;
  }
});

/**
 * Site favicon — admin-uploaded via components/admin/favicon-uploader.tsx,
 * same site_settings key/value row shape as the hero image(s) (key:
 * favicon_url). No seed fallback: an unset/unreachable value just means the
 * browser default favicon, same reasoning as hero images.
 */
const FAVICON_KEY = "favicon_url";

export const getFaviconUrl = cache(async (): Promise<string | null> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", FAVICON_KEY).maybeSingle();
    if (error) throw new Error(`getFaviconUrl: ${error.message}`);
    return data?.value ?? null;
  } catch (err) {
    console.warn("[lib/data/settings] getFaviconUrl falling back to no favicon:", err);
    return null;
  }
});

/**
 * Seconds per homepage hero slide — admin-set via
 * components/admin/hero-slide-speed.tsx (key: hero_slide_interval). Limits
 * and the default live in lib/data/hero-speed.ts; unset or unreachable means
 * the default, like the hero slides themselves.
 */
const HERO_SLIDE_INTERVAL_KEY = "hero_slide_interval";

export const getHeroSlideInterval = cache(async (): Promise<number> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", HERO_SLIDE_INTERVAL_KEY)
      .maybeSingle();
    if (error) throw new Error(`getHeroSlideInterval: ${error.message}`);
    return data?.value ? clampSlideInterval(data.value) : DEFAULT_SLIDE_INTERVAL;
  } catch (err) {
    console.warn("[lib/data/settings] getHeroSlideInterval falling back to the default speed:", err);
    return DEFAULT_SLIDE_INTERVAL;
  }
});
