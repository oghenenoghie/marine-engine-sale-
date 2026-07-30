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
