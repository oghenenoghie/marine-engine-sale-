import Link from "next/link";
import Image from "next/image";
import { Ship, ImageIcon } from "lucide-react";
import type { StockItemView } from "@/types";
import { formatPrice, primaryImage } from "@/lib/utils";
import { StatusBadge } from "@/components/stock/status-badge";

export function StockCard({ item }: { item: StockItemView }) {
  const img = primaryImage(item.images);
  const href = `/${item.type === "engine" ? "engines" : "parts"}/${item.slug}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-md border border-steel/15 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full bg-paper">
        {img ? (
          <Image
            src={img.url}
            alt={img.alt}
            fill
            unoptimized
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-steel/40">
            {item.type === "engine" ? <Ship size={32} /> : <ImageIcon size={32} />}
          </div>
        )}
        <div className="absolute left-3 top-3">
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
