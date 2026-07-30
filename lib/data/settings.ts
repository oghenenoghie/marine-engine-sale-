import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/server";

/**
 * Small admin-editable site content that doesn't warrant its own table —
 * see supabase/migrations/0006_site_settings.sql. RLS: public read, admin
 * write via lib/actions/settings.ts. No seed fallback: unlike taxonomy/stock
 * this is optional decoration, so an unreachable/unconfigured Supabase
 * project just means "no hero image" rather than a page that needs to degrade.
 */

const HERO_IMAGE_KEY = "hero_image_url";

export const getHeroImageUrl = cache(async (): Promise<string | null> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", HERO_IMAGE_KEY).maybeSingle();
    if (error) throw new Error(`getHeroImageUrl: ${error.message}`);
    return data?.value ?? null;
  } catch (err) {
    console.warn("[lib/data/settings] getHeroImageUrl falling back to no image:", err);
    return null;
  }
});
