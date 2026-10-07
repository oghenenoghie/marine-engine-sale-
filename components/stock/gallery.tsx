import { TechnicalDrawing } from "@/components/stock/technical-drawing";
import type { StockType } from "@/types";

export function Gallery({ categorySlug, itemType }: { categorySlug: string; itemType: StockType }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-steel/15">
      <TechnicalDrawing categorySlug={categorySlug} itemType={itemType} />
    </div>
  );
}
