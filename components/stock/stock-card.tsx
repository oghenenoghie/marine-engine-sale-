import Link from "next/link";
import Image from "next/image";
import type { StockItemView } from "@/types";
import { formatPrice, primaryImage } from "@/lib/utils";
import { RENTAL_DRAWINGS } from "@/lib/data/rentals";
import { StatusBadge } from "@/components/stock/status-badge";
import { TechnicalDrawing } from "@/components/stock/technical-drawing";

/** Stable per-item pick, so a card keeps the same stand-in drawing across renders and the grid varies. */
function standInDrawing(id: string): string | undefined {
  if (RENTAL_DRAWINGS.length === 0) return undefined;
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return RENTAL_DRAWINGS[hash % RENTAL_DRAWINGS.length];
}

export function StockCard({ item }: { item: StockItemView }) {
  const href = `/${item.type === "engine" ? "engines" : "parts"}/${item.slug}`;
  const photo = primaryImage(item.images.filter((img) => img.type === "photo"));
  const drawing = photo ? undefined : standInDrawing(item.id);

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-sm border border-steel/15 bg-white transition-colors duration-300 hover:border-hull/40"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {photo ? (
          // Supabase Storage public URL — `unoptimized` bypasses the Cloudinary loader (see CLAUDE.md).
          <Image
            src={photo.url}
            alt={photo.alt}
            fill
            unoptimized
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="bg-white object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : drawing ? (
          // No photo yet: one of the rental fleet drawings as stand-in artwork (decorative — not the item itself).
          <div className="relative h-full w-full bg-hull">
            <div className="tech-grid absolute inset-0 opacity-30" aria-hidden />
            <Image
              src={drawing}
              alt=""
              fill
              unoptimized
              className="object-contain p-3 opacity-90 transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <TechnicalDrawing
            categorySlug={item.category.slug}
            itemType={item.type}
            className="transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
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
