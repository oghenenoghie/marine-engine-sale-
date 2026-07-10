import { getAllStock } from "@/lib/data/stock";
import type { StockItemView } from "@/types";

/**
 * Launch-stage part-number search: prefix/substring match on SKU, OEM
 * numbers and title. At scale, replace the body with a `pg_trgm`
 * similarity query (`ORDER BY similarity(...) DESC`) or a Meilisearch call.
 */
export function searchStock(query: string, limit = 8): StockItemView[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = getAllStock().map((item) => {
    const oemHit = item.oemNumbers.some((n) => n.toLowerCase().includes(q));
    const skuHit = item.sku.toLowerCase().includes(q);
    const titleHit = item.title.toLowerCase().includes(q);
    let score = 0;
    if (item.sku.toLowerCase().startsWith(q)) score += 3;
    else if (skuHit) score += 2;
    if (oemHit) score += 2;
    if (titleHit) score += 1;
    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);
}
