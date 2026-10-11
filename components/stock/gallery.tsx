"use client";

import Image from "next/image";
import { useState } from "react";
import { TechnicalDrawing } from "@/components/stock/technical-drawing";
import { cn, primaryImage } from "@/lib/utils";
import type { StockImage, StockType } from "@/types";

/**
 * Item-detail gallery: the item's uploaded photos (primary first, thumbnails
 * to switch), or — with no photos yet — the part-category technical drawing.
 */
export function Gallery({
  images,
  categorySlug,
  itemType,
}: {
  images: StockImage[];
  categorySlug: string;
  itemType: StockType;
}) {
  const [active, setActive] = useState(0);
  const uploaded = images.filter((img) => img.type === "photo");
  const primary = primaryImage(uploaded);
  const photos = primary ? [primary, ...uploaded.filter((img) => img !== primary)] : [];

  if (photos.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-steel/15">
        <TechnicalDrawing categorySlug={categorySlug} itemType={itemType} />
      </div>
    );
  }

  const current = photos[active] ?? photos[0]!;

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-steel/15 bg-white">
        {/* Supabase Storage public URLs — `unoptimized` bypasses the Cloudinary loader (see CLAUDE.md). */}
        <Image
          src={current.url}
          alt={current.alt}
          fill
          unoptimized
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
        />
      </div>
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {photos.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border transition-colors",
                i === active ? "border-hull" : "border-steel/20 hover:border-steel/50",
              )}
            >
              <Image src={img.url} alt={img.alt} fill unoptimized className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
