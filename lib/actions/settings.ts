"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin, type ActionResult } from "@/lib/actions/auth";
import type { HeroSlide } from "@/lib/data/settings";
import { SLIDE_INTERVAL_MAX, SLIDE_INTERVAL_MIN, clampSlideInterval } from "@/lib/data/hero-speed";

export type { ActionResult };

const HERO_SLIDES_KEY = "hero_slides";
const FAVICON_KEY = "favicon_url";
const HERO_SLIDE_INTERVAL_KEY = "hero_slide_interval";

export async function saveHeroSlidesAction(slides: HeroSlide[]): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  const trimmed: HeroSlide[] = slides.map((s) => ({
    id: s.id,
    eyebrow: s.eyebrow.trim(),
    headline: s.headline.trim(),
    body: s.body.trim(),
    primaryHref: s.primaryHref.trim(),
    primaryLabel: s.primaryLabel.trim(),
    secondaryHref: s.secondaryHref.trim(),
    secondaryLabel: s.secondaryLabel.trim(),
    backgroundImage: s.backgroundImage.trim(),
    drawingUrl: s.drawingUrl.trim(),
    drawingCaption: s.drawingCaption.trim(),
  }));
  if (trimmed.length === 0) {
    return { ok: false, error: "At least one hero slide is required." };
  }
  const incomplete = trimmed.find(
    (s) => !s.eyebrow || !s.headline || !s.body || !s.primaryHref || !s.primaryLabel || !s.secondaryHref || !s.secondaryLabel,
  );
  if (incomplete) {
    return { ok: false, error: "Every hero slide needs an eyebrow, headline, body and both CTAs filled in." };
  }
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: HERO_SLIDES_KEY, value: JSON.stringify(trimmed), updated_at: new Date().toISOString() });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error saving hero slides" };
  }
}

export async function saveFaviconAction(url: string | null): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: FAVICON_KEY, value: url, updated_at: new Date().toISOString() });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error saving favicon" };
  }
}

export async function saveHeroSlideIntervalAction(seconds: number): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  if (!Number.isFinite(seconds) || seconds < SLIDE_INTERVAL_MIN || seconds > SLIDE_INTERVAL_MAX) {
    return { ok: false, error: `Seconds per slide must be between ${SLIDE_INTERVAL_MIN} and ${SLIDE_INTERVAL_MAX}.` };
  }
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("site_settings").upsert({
      key: HERO_SLIDE_INTERVAL_KEY,
      value: String(clampSlideInterval(seconds)),
      updated_at: new Date().toISOString(),
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error saving slide speed" };
  }
}
