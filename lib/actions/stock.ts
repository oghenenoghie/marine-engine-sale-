"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { StockItem, Hotspot } from "@/types";
import type { Json } from "@/types/supabase";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") {
    throw new Error("Not authorized");
  }
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

export async function saveStockItemAction(item: StockItem) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("stock_items").upsert({
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
  if (error) throw new Error(error.message);
  revalidateStockPaths();
}

export async function deleteStockItemAction(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("stock_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateStockPaths();
}

export async function saveDrawingHotspotsAction(drawingId: string, hotspots: Hotspot[]) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("drawings").update({ hotspots: hotspots as unknown as Json }).eq("id", drawingId);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/drawings/[id]", "page");
  revalidatePath("/admin/drawings");
  revalidatePath(`/admin/drawings/${drawingId}`);
  revalidateStockPaths();
}
