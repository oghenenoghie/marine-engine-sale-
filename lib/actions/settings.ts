"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin, type ActionResult } from "@/lib/actions/auth";
import type { HeroCopy } from "@/lib/data/settings";

export type { ActionResult };

const HERO_IMAGES_KEY = "hero_images";
const HERO_COPY_KEY = "hero_copy";

export async function saveHeroImagesAction(urls: string[]): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: HERO_IMAGES_KEY, value: JSON.stringify(urls), updated_at: new Date().toISOString() });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error saving hero images" };
  }
}

export async function saveHeroCopyAction(copy: HeroCopy): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  const trimmed: HeroCopy = {
    eyebrow: copy.eyebrow.trim(),
    headline: copy.headline.trim(),
    paragraph: copy.paragraph.trim(),
    tagline: copy.tagline.trim(),
  };
  if (!trimmed.eyebrow || !trimmed.headline || !trimmed.paragraph || !trimmed.tagline) {
    return { ok: false, error: "All hero copy fields are required." };
  }
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: HERO_COPY_KEY, value: JSON.stringify(trimmed), updated_at: new Date().toISOString() });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error saving hero copy" };
  }
}
