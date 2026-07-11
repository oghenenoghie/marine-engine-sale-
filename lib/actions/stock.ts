"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient, createPublicClient } from "@/lib/supabase/server";
import type { StockItem, Hotspot } from "@/types";
import type { Json } from "@/types/supabase";

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Server actions redact thrown errors into a generic digest message in
 * production — so every action here catches internally and returns a
 * plain result object instead of throwing, to keep real error text visible
 * to the admin UI.
 */
async function requireAdmin(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };
  if (user.app_metadata?.role !== "admin") return { ok: false, error: "Signed in, but this account is not an admin." };
  return { ok: true };
}

function revalidateStockPaths() {
  revalidatePath("/");
  revalidatePath("/stock");
  revalidatePath("/parts");
  revalidatePath("/engines");
  revalidatePath("/parts/[slug]", "page");
  revalidatePath("/engines/[slug]", "page");
  revalidatePath("/brands/[brand]", "page");
  revalidatePath("/brands/[brand]/[model]", "page");
  revalidatePath("/admin/stock");
  revalidatePath("/admin");
}

export async function saveStockItemAction(item: StockItem): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("stock_items").upsert({
      id: item.id,
      sku: item.sku,
      slug: item.slug,
      title: item.title,
      type: item.type,
      brand_id: item.brandId,
      model_id: item.modelId ?? null,
      category_id: item.categoryId,
      condition: item.condition,
      poa: item.poa,
      price: item.poa ? null : item.price,
      qty: item.qty,
      status: item.status,
      oem_numbers: item.oemNumbers,
      specs: item.specs as unknown as Json,
      images: item.images as unknown as Json,
      drawing_id: item.drawingId ?? null,
      description: item.description || null,
      created_at: item.createdAt,
    });
    if (error) return { ok: false, error: error.message };
    revalidateStockPaths();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error saving stock item" };
  }
}

export async function deleteStockItemAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("stock_items").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateStockPaths();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error deleting stock item" };
  }
}

export async function saveDrawingHotspotsAction(drawingId: string, hotspots: Hotspot[]): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("drawings").update({ hotspots: hotspots as unknown as Json }).eq("id", drawingId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/drawings/[id]", "page");
    revalidatePath("/admin/drawings");
    revalidatePath(`/admin/drawings/${drawingId}`);
    revalidateStockPaths();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error saving hotspots" };
  }
}

export interface DbTestStep {
  label: string;
  ok: boolean;
  detail: string;
  ms: number;
}

export interface DbTestReport {
  ok: boolean;
  steps: DbTestStep[];
}

const TEST_SKU = "__DB_TEST__";

/**
 * End-to-end round trip against the live database: verifies the caller is
 * an authenticated admin, writes a throwaway row via the service-role
 * client (same path saveStockItemAction uses), reads it back via the
 * public anon client (same path every public page uses), then deletes it.
 * Exercises SUPABASE_SERVICE_ROLE_KEY, RLS public-read, and admin auth in
 * one pass instead of needing to dig through logs.
 */
export async function testDbConnectionAction(): Promise<DbTestReport> {
  const steps: DbTestStep[] = [];
  const run = async (label: string, fn: () => Promise<string>) => {
    const start = Date.now();
    try {
      const detail = await fn();
      steps.push({ label, ok: true, detail, ms: Date.now() - start });
      return true;
    } catch (err) {
      steps.push({
        label,
        ok: false,
        detail: err instanceof Error ? err.message : "Unknown error",
        ms: Date.now() - start,
      });
      return false;
    }
  };

  const authOk = await run("Verify admin session", async () => {
    const admin = await requireAdmin();
    if (!admin.ok) throw new Error(admin.error);
    return "Signed in with app_metadata.role = admin";
  });
  if (!authOk) return { ok: false, steps };

  const testId = "00000000-0000-4000-8000-00000000test".replace("test", Math.random().toString(16).slice(2, 6));

  let brandId: string | undefined;
  let categoryId: string | undefined;
  const refsOk = await run("Look up reference brand/category ids", async () => {
    const supabase = createPublicClient();
    const [{ data: brand, error: brandError }, { data: category, error: categoryError }] = await Promise.all([
      supabase.from("brands").select("id").limit(1).maybeSingle(),
      supabase.from("part_categories").select("id").limit(1).maybeSingle(),
    ]);
    if (brandError) throw new Error(brandError.message);
    if (categoryError) throw new Error(categoryError.message);
    if (!brand || !category) throw new Error("No brands/categories found — is the taxonomy seeded?");
    brandId = brand.id;
    categoryId = category.id;
    return `brand_id ${brand.id}, category_id ${category.id}`;
  });
  if (!refsOk) return { ok: false, steps };

  const insertOk = await run("Insert throwaway row (service-role client)", async () => {
    const admin = createAdminClient();
    const { error } = await admin.from("stock_items").insert({
      id: testId,
      sku: TEST_SKU,
      slug: `db-test-${testId}`,
      title: "DB connection test row",
      type: "part",
      brand_id: brandId!,
      model_id: null,
      category_id: categoryId!,
      condition: "Used",
      poa: true,
      price: null,
      qty: 1,
      status: "available",
      oem_numbers: [],
      specs: {} as unknown as Json,
      images: [] as unknown as Json,
      drawing_id: null,
      description: "Created by /admin/db-test — safe to ignore, auto-deleted.",
    });
    if (error) throw new Error(error.message);
    return `Inserted id ${testId}`;
  });

  if (insertOk) {
    await run("Read it back (public anon client, RLS public-read)", async () => {
      const supabase = createPublicClient();
      const { data, error } = await supabase.from("stock_items").select("id,title").eq("id", testId).maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) throw new Error("Row not found on read-back — RLS public-read policy may be missing");
      return `Read back "${data.title}"`;
    });

    await run("Delete throwaway row (cleanup)", async () => {
      const admin = createAdminClient();
      const { error } = await admin.from("stock_items").delete().eq("id", testId);
      if (error) throw new Error(error.message);
      return "Deleted";
    });
  }

  return { ok: steps.every((s) => s.ok), steps };
}
