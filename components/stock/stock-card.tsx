import Link from "next/link";
import type { StockItemView } from "@/types";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/stock/status-badge";
import { TechnicalDrawing } from "@/components/stock/technical-drawing";

export function StockCard({ item }: { item: StockItemView }) {
  const href = `/${item.type === "engine" ? "engines" : "parts"}/${item.slug}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-sm border border-steel/15 bg-white transition-colors duration-300 hover:border-hull/40"
    >
      <div className="relative aspect-[4/3] w-full">
        <TechnicalDrawing
          categorySlug={item.category.slug}
          itemType={item.type}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 rounded-sm bg-paper/95 p-0.5">
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="space-y-1.5 p-4">
        <div className="label text-steel/70">
          {item.brand.name} {item.model ? `· ${item.model.name}` : ""}
        </div>
        <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-hull">{item.title}</h3>
        <div className="flex items-center justify-between pt-1">
          <span className="data text-steel">{item.sku}</span>
          <span className="data font-semibold text-hull">{formatPrice(item.price, item.poa, item.currency)}</span>
        </div>
      </div>
    </Link>
  );
}
