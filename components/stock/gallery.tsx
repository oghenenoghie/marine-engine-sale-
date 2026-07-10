"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockImage } from "@/types";

export function Gallery({ images, title }: { images: StockImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const photos = images.filter((img) => img.type === "photo");

  if (photos.length === 0) {
    return (
      <div className="grid aspect-[4/3] w-full place-items-center rounded-md border border-steel/15 bg-white text-steel/40">
        <ImageIcon size={40} />
      </div>
    );
  }

  const current = photos[active] ?? photos[0]!;

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-steel/15 bg-white">
        <Image
          src={current.publicId}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
        />
      </div>
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {photos.map((img, i) => (
            <button
              key={img.publicId + i}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded border",
                i === active ? "border-blueprint" : "border-steel/20",
              )}
            >
              <Image src={img.publicId} alt={img.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
