"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin, type ActionResult } from "@/lib/actions/auth";
import type { Brand, EngineModel, PartCategory } from "@/types";

export type { ActionResult };

function revalidateTaxonomyPaths() {
  revalidatePath("/");
  revalidatePath("/stock");
  revalidatePath("/parts");
  revalidatePath("/engines");
  revalidatePath("/parts/[slug]", "page");
  revalidatePath("/engines/[slug]", "page");
  revalidatePath("/brands");
  revalidatePath("/brands/[brand]", "page");
  revalidatePath("/brands/[brand]/[model]", "page");
  revalidatePath("/admin/brands");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/stock");
  revalidatePath("/sell");
}

export async function saveBrandAction(brand: Brand): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("brands").upsert({
      id: brand.id,
      slug: brand.slug,
      name: brand.name,
      logo: brand.logo || null,
      blurb: brand.blurb || null,
    });
    if (error) return { ok: false, error: error.message };
    revalidateTaxonomyPaths();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error saving brand" };
  }
}

export async function deleteBrandAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateTaxonomyPaths();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error deleting brand" };
  }
}

export async function saveModelAction(model: EngineModel): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("engine_models").upsert({
      id: model.id,
      slug: model.slug,
      brand_id: model.brandId,
      name: model.name,
      bore: model.bore || null,
      stroke: model.stroke || null,
      config: model.config || null,
      power_range: model.powerRange || null,
    });
    if (error) return { ok: false, error: error.message };
    revalidateTaxonomyPaths();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error saving model" };
  }
}

export async function deleteModelAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("engine_models").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateTaxonomyPaths();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error deleting model" };
  }
}

export async function saveCategoryAction(category: PartCategory): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("part_categories").upsert({
      id: category.id,
      slug: category.slug,
      name: category.name,
      parent_id: category.parentId ?? null,
    });
    if (error) return { ok: false, error: error.message };
    revalidateTaxonomyPaths();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error saving category" };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("part_categories").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateTaxonomyPaths();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error deleting category" };
  }
}
