import { FacetRail } from "@/components/stock/facet-rail";
import { StockCard } from "@/components/stock/stock-card";
import { getStock, type StockFilters } from "@/lib/data/stock";
import { getAllBrands } from "@/lib/data/taxonomy";
import type { Condition, StockStatus } from "@/types";

export interface StockListingSearchParams {
  q?: string;
  brand?: string;
  model?: string;
  category?: string;
  condition?: string;
  status?: string;
}

export async function StockListing({
  type,
  productCategory,
  searchParams,
  emptyLabel = "item",
}: {
  type?: "engine" | "part";
  productCategory?: string;
  searchParams: StockListingSearchParams;
  emptyLabel?: string;
}) {
  const filters: StockFilters = {
    type,
    productCategory,
    q: searchParams.q,
    brand: searchParams.brand,
    model: searchParams.model,
    category: searchParams.category,
    condition: searchParams.condition as Condition | undefined,
    status: searchParams.status as StockStatus | undefined,
  };

  const [items, brands] = await Promise.all([getStock(filters), getAllBrands()]);

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <FacetRail brands={brands} />
      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <span className="data text-steel">
            {items.length} {emptyLabel}
            {items.length === 1 ? "" : "s"}
          </span>
        </div>
        {items.length === 0 ? (
          <p className="rounded-md border border-dashed border-steel/25 py-16 text-center text-[13px] text-steel">
            No {emptyLabel}s match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <StockCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
