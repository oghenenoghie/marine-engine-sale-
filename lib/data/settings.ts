import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/server";

/**
 * Small admin-editable site content that doesn't warrant its own table —
 * see supabase/migrations/0006_site_settings.sql. RLS: public read, admin
 * write via lib/actions/settings.ts. No seed fallback: unlike taxonomy/stock
 * this is optional decoration, so an unreachable/unconfigured Supabase
 * project just means "no hero images" rather than a page that needs to degrade.
 *
 * Hero images are stored as a JSON-encoded array of Supabase Storage public
 * URLs in the `value` text column (key: hero_images) — the homepage hero is
 * a slider, not a single background photo.
 */

const HERO_IMAGES_KEY = "hero_images";

export const getHeroImages = cache(async (): Promise<string[]> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", HERO_IMAGES_KEY).maybeSingle();
    if (error) throw new Error(`getHeroImages: ${error.message}`);
    if (!data?.value) return [];
    const parsed = JSON.parse(data.value);
    return Array.isArray(parsed) ? parsed.filter((url): url is string => typeof url === "string") : [];
  } catch (err) {
    console.warn("[lib/data/settings] getHeroImages falling back to no images:", err);
    return [];
  }
});

/**
 * Homepage hero copy (eyebrow badge, headline, paragraph, bottom tagline
 * badge) — admin-editable via components/admin/hero-copy-editor.tsx, same
 * site_settings key/value row shape as hero images (key: hero_copy).
 * Unlike hero images, there's no reasonable "empty" state for hero copy, so
 * this falls back to the original launch copy (DEFAULT_HERO_COPY) rather
 * than blanks when unset or Supabase is unreachable.
 */
export type HeroCopy = {
  eyebrow: string;
  headline: string;
  paragraph: string;
  tagline: string;
};

export const DEFAULT_HERO_COPY: HeroCopy = {
  eyebrow: "Marine diesel · engines & parts",
  headline: "Trading the fleet — engines, parts and power, across every major brand.",
  paragraph:
    "Shipcove Trading trades complete marine diesel engines and spare parts across Wärtsilä, MAN, MaK, Deutz and Caterpillar — searchable by OEM number, by model, and through interactive exploded diagrams that link straight to live stock.",
  tagline: "Drawing-driven part discovery",
};

const HERO_COPY_KEY = "hero_copy";

export const getHeroCopy = cache(async (): Promise<HeroCopy> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", HERO_COPY_KEY).maybeSingle();
    if (error) throw new Error(`getHeroCopy: ${error.message}`);
    if (!data?.value) return DEFAULT_HERO_COPY;
    const parsed = JSON.parse(data.value);
    return {
      eyebrow: typeof parsed.eyebrow === "string" && parsed.eyebrow.trim() ? parsed.eyebrow : DEFAULT_HERO_COPY.eyebrow,
      headline: typeof parsed.headline === "string" && parsed.headline.trim() ? parsed.headline : DEFAULT_HERO_COPY.headline,
      paragraph:
        typeof parsed.paragraph === "string" && parsed.paragraph.trim() ? parsed.paragraph : DEFAULT_HERO_COPY.paragraph,
      tagline: typeof parsed.tagline === "string" && parsed.tagline.trim() ? parsed.tagline : DEFAULT_HERO_COPY.tagline,
    };
  } catch (err) {
    console.warn("[lib/data/settings] getHeroCopy falling back to default copy:", err);
    return DEFAULT_HERO_COPY;
  }
});

/**
 * Technical line-drawing(s) shown in the homepage hero, each with a short
 * caption — admin-editable via components/admin/hero-drawings-uploader.tsx,
 * same site_settings key/value row shape as hero images/copy (key:
 * hero_drawings). Unlike the hero photo slider (which can legitimately be
 * empty), the hero always shows at least one vessel drawing, so this falls
 * back to DEFAULT_HERO_DRAWINGS (the originally-shipped well-intervention
 * vessel asset in public/hero/) rather than an empty array, same reasoning
 * as DEFAULT_HERO_COPY.
 */
export type HeroDrawing = {
  url: string;
  caption: string;
};

export const DEFAULT_HERO_DRAWINGS: HeroDrawing[] = [
  {
    url: "/hero/well-intervention-vessel.png",
    caption: "Light well intervention vessel — technical line drawing",
  },
];

const HERO_DRAWINGS_KEY = "hero_drawings";

export const getHeroDrawings = cache(async (): Promise<HeroDrawing[]> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", HERO_DRAWINGS_KEY).maybeSingle();
    if (error) throw new Error(`getHeroDrawings: ${error.message}`);
    if (!data?.value) return DEFAULT_HERO_DRAWINGS;
    const parsed = JSON.parse(data.value);
    if (!Array.isArray(parsed)) return DEFAULT_HERO_DRAWINGS;
    const drawings = parsed.filter(
      (d): d is HeroDrawing => typeof d === "object" && d !== null && typeof d.url === "string" && d.url.trim() !== "",
    ).map((d) => ({ url: d.url, caption: typeof d.caption === "string" ? d.caption : "" }));
    return drawings.length > 0 ? drawings : DEFAULT_HERO_DRAWINGS;
  } catch (err) {
    console.warn("[lib/data/settings] getHeroDrawings falling back to default drawing:", err);
    return DEFAULT_HERO_DRAWINGS;
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
