import { cache } from "react";
import type { StockItem, StockItemView, StockStatus, Condition, StockImage, Drawing, Hotspot } from "@/types";
import { createPublicClient } from "@/lib/supabase/server";
import { getAllBrands, getAllCategories, getAllModels, getAllProductCategories } from "@/lib/data/taxonomy";
import { brandsSeed, engineModelsSeed, partCategoriesSeed, productCategoriesSeed } from "@/lib/data/taxonomy.seed";
import { stockSeed } from "@/lib/data/stock.seed";
import { drawingsSeed } from "@/lib/data/drawings.seed";
import type { Database } from "@/types/supabase";

/**
 * Supabase-backed data-access layer (RLS: public read, admin write via
 * lib/actions/stock.ts). Falls back to lib/data/*.seed.ts when Supabase is
 * unreachable or unconfigured, so pages don't 500 in local/demo
 * environments without a live project.
 */

function warnFallback(name: string, err: unknown) {
  console.warn(`[lib/data/stock] ${name} falling back to seed fixtures:`, err);
}

export interface StockFilters {
  q?: string;
  brand?: string; // slug
  model?: string; // slug
  category?: string; // slug
  productCategory?: string; // slug
  condition?: Condition;
  status?: StockStatus;
  type?: "engine" | "part";
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type StockRow = Database["public"]["Tables"]["stock_items"]["Row"];
type DrawingRow = Database["public"]["Tables"]["drawings"]["Row"];

function rowToStockItem(row: StockRow): StockItem {
  return {
    id: row.id,
    sku: row.sku,
    title: row.title,
    slug: row.slug,
    type: row.type,
    brandId: row.brand_id,
    modelId: row.model_id,
    categoryId: row.category_id,
    productCategoryId: row.product_category_id,
    condition: row.condition,
    poa: row.poa,
    price: row.price,
    currency: row.currency,
    qty: row.qty,
    status: row.status,
    oemNumbers: row.oem_numbers ?? [],
    specs: (row.specs ?? {}) as Record<string, string>,
    images: (row.images ?? []) as unknown as StockImage[],
    drawingId: row.drawing_id,
    description: row.description ?? undefined,
    createdAt: row.created_at,
  };
}

function rowToDrawing(row: DrawingRow): Drawing {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    modelId: row.model_id,
    assetKey: row.asset_key,
    hotspots: (row.hotspots ?? []) as unknown as Hotspot[],
  };
}

function denormalize(
  item: StockItem,
  brands: Awaited<ReturnType<typeof getAllBrands>>,
  models: Awaited<ReturnType<typeof getAllModels>>,
  categories: Awaited<ReturnType<typeof getAllCategories>>,
  productCategories: Awaited<ReturnType<typeof getAllProductCategories>>,
): StockItemView | null {
  const brand = brands.find((b) => b.id === item.brandId);
  const category = categories.find((c) => c.id === item.categoryId);
  if (!brand || !category) return null; // orphaned FK — skip rather than crash the page
  const model = item.modelId ? models.find((m) => m.id === item.modelId) : undefined;
  const productCategory = item.productCategoryId ? productCategories.find((c) => c.id === item.productCategoryId) : undefined;
  return { ...item, brand, model, category, productCategory };
}

export const getAllStock = cache(async (): Promise<StockItemView[]> => {
  try {
    const supabase = createPublicClient();
    const [{ data, error }, brands, models, categories, productCategories] = await Promise.all([
      supabase.from("stock_items").select("*").order("created_at", { ascending: false }),
      getAllBrands(),
      getAllModels(),
      getAllCategories(),
      getAllProductCategories(),
    ]);
    if (error) throw new Error(`getAllStock: ${error.message}`);
    return (data ?? [])
      .map(rowToStockItem)
      .map((item) => denormalize(item, brands, models, categories, productCategories))
      .filter((item): item is StockItemView => item !== null);
  } catch (err) {
    warnFallback("getAllStock", err);
    return stockSeed
      .map((item) => denormalize(item, brandsSeed, engineModelsSeed, partCategoriesSeed, productCategoriesSeed))
      .filter((item): item is StockItemView => item !== null);
  }
});

export async function getStock(filters: StockFilters = {}): Promise<StockItemView[]> {
  const q = filters.q?.trim().toLowerCase();
  const all = await getAllStock();
  return all.filter((item) => {
    const matchQ =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.oemNumbers.some((n) => n.toLowerCase().includes(q));
    const matchBrand = !filters.brand || item.brand.slug === filters.brand;
    const matchModel = !filters.model || item.model?.slug === filters.model;
    const matchCategory = !filters.category || item.category.slug === filters.category;
    const matchProductCategory = !filters.productCategory || item.productCategory?.slug === filters.productCategory;
    const matchCondition = !filters.condition || item.condition === filters.condition;
    const matchStatus = !filters.status || item.status === filters.status;
    const matchType = !filters.type || item.type === filters.type;
    return matchQ && matchBrand && matchModel && matchCategory && matchProductCategory && matchCondition && matchStatus && matchType;
  });
}

export const getStockBySlug = cache(async (slug: string): Promise<StockItemView | undefined> => {
  try {
    const supabase = createPublicClient();
    const [{ data, error }, brands, models, categories, productCategories] = await Promise.all([
      supabase.from("stock_items").select("*").eq("slug", slug).maybeSingle(),
      getAllBrands(),
      getAllModels(),
      getAllCategories(),
      getAllProductCategories(),
    ]);
    if (error) throw new Error(`getStockBySlug: ${error.message}`);
    if (!data) return undefined;
    return denormalize(rowToStockItem(data), brands, models, categories, productCategories) ?? undefined;
  } catch (err) {
    warnFallback("getStockBySlug", err);
    const item = stockSeed.find((s) => s.slug === slug);
    return item ? denormalize(item, brandsSeed, engineModelsSeed, partCategoriesSeed, productCategoriesSeed) ?? undefined : undefined;
  }
});

export async function getFeaturedStock(limit = 6): Promise<StockItemView[]> {
  const all = await getAllStock();
  return all.filter((i) => i.status === "available").slice(0, limit);
}

export async function getRecentlySold(limit = 4): Promise<StockItemView[]> {
  const all = await getAllStock();
  return all.filter((i) => i.status === "sold").slice(0, limit);
}

export const getDrawing = cache(async (id: string): Promise<Drawing | undefined> => {
  try {
    const supabase = createPublicClient();
    const query = supabase.from("drawings").select("*");
    const { data, error } = UUID_RE.test(id)
      ? await query.or(`id.eq.${id},slug.eq.${id}`).maybeSingle()
      : await query.eq("slug", id).maybeSingle();
    if (error) throw new Error(`getDrawing: ${error.message}`);
    return data ? rowToDrawing(data) : undefined;
  } catch (err) {
    warnFallback("getDrawing", err);
    return drawingsSeed.find((d) => d.id === id || d.slug === id);
  }
});

export async function getDrawingsForModel(modelId: string): Promise<Drawing[]> {
  const all = await getAllDrawings();
  return all.filter((d) => d.modelId === modelId);
}

export const getAllDrawings = cache(async (): Promise<Drawing[]> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("drawings").select("*");
    if (error) throw new Error(`getAllDrawings: ${error.message}`);
    return (data ?? []).map(rowToDrawing);
  } catch (err) {
    warnFallback("getAllDrawings", err);
    return drawingsSeed;
  }
});
