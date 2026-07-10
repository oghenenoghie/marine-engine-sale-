import type { StockItem, StockItemView, StockStatus, Condition } from "@/types";
import { stockSeed } from "@/lib/data/stock.seed";
import { drawingsSeed } from "@/lib/data/drawings.seed";
import { brands, engineModels, partCategories } from "@/lib/data/taxonomy";

/**
 * In-memory data-access layer. Shaped like the Postgres queries it will
 * become (facet filters -> indexed WHERE, part-number search -> pg_trgm)
 * so swapping in `lib/supabase/server.ts` later only touches this file.
 */

export interface StockFilters {
  q?: string;
  brand?: string; // slug
  model?: string; // slug
  category?: string; // slug
  condition?: Condition;
  status?: StockStatus;
  type?: "engine" | "part";
}

function denormalize(item: StockItem): StockItemView {
  const brand = brands.find((b) => b.id === item.brandId)!;
  const model = engineModels.find((m) => m.id === item.modelId);
  const category = partCategories.find((c) => c.id === item.categoryId)!;
  return { ...item, brand, model, category };
}

export function getAllStock(): StockItemView[] {
  return stockSeed.map(denormalize);
}

export function getStock(filters: StockFilters = {}): StockItemView[] {
  const q = filters.q?.trim().toLowerCase();
  return getAllStock().filter((item) => {
    const matchQ =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.oemNumbers.some((n) => n.toLowerCase().includes(q));
    const matchBrand = !filters.brand || item.brand.slug === filters.brand;
    const matchModel = !filters.model || item.model?.slug === filters.model;
    const matchCategory = !filters.category || item.category.slug === filters.category;
    const matchCondition = !filters.condition || item.condition === filters.condition;
    const matchStatus = !filters.status || item.status === filters.status;
    const matchType = !filters.type || item.type === filters.type;
    return matchQ && matchBrand && matchModel && matchCategory && matchCondition && matchStatus && matchType;
  });
}

export function getStockBySlug(slug: string): StockItemView | undefined {
  const item = stockSeed.find((i) => i.slug === slug);
  return item ? denormalize(item) : undefined;
}

export function getFeaturedStock(limit = 6): StockItemView[] {
  return getAllStock()
    .filter((i) => i.status === "available")
    .slice(0, limit);
}

export function getRecentlySold(limit = 4): StockItemView[] {
  return getAllStock()
    .filter((i) => i.status === "sold")
    .slice(0, limit);
}

export function getDrawing(id: string) {
  return drawingsSeed.find((d) => d.id === id || d.slug === id);
}

export function getDrawingsForModel(modelId: string) {
  return drawingsSeed.filter((d) => d.modelId === modelId);
}

export function getAllDrawings() {
  return drawingsSeed;
}
