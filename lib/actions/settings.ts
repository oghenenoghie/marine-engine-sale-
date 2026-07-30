"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin, type ActionResult } from "@/lib/actions/auth";

export type { ActionResult };

const HERO_IMAGES_KEY = "hero_images";

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
