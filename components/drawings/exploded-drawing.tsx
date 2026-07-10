"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { cn, formatPrice } from "@/lib/utils";
import type { Hotspot, StockItemView } from "@/types";

interface ExplodedDrawingProps {
  assetKey: string;
  title: string;
  hotspots: Hotspot[];
  /** Resolved StockItemView per hotspot.stockItemId, keyed by stock item id. */
  stockById?: Record<string, StockItemView>;
}

export function ExplodedDrawing({ assetKey, title, hotspots, stockById = {} }: ExplodedDrawingProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = hotspots.find((h) => h.id === activeId);
  const activeStock = active?.stockItemId ? stockById[active.stockItemId] : undefined;

  return (
    <figure className="relative w-full overflow-hidden rounded-md border border-steel/25 bg-hull">
      <div className="relative aspect-[4/3] w-full">
        <Image src={cloudinaryUrl(assetKey, "f_auto,q_auto,w_1600")} alt={title} fill className="object-contain" priority />

        {hotspots.map((h) => (
          <button
            key={h.id}
            onClick={() => setActiveId(h.id === activeId ? null : h.id)}
            style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
            aria-label={h.label}
            aria-pressed={h.id === activeId}
            className={cn(
              "absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border font-mono text-[11px] backdrop-blur transition-colors",
              "border-steel/60 bg-paper/90 text-hull",
              h.inStock && "border-signal text-signal",
              h.id === activeId && "ring-2 ring-blueprint",
            )}
          >
            {h.id}
          </button>
        ))}
      </div>

      {active && (
        <div className="border-t border-paper/10 bg-hull p-4 text-paper">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="label text-signal">Callout {active.id}</div>
              <div className="font-display text-base font-bold">{active.label}</div>
            </div>
            {activeStock && <span className="data shrink-0 text-paper/80">{formatPrice(activeStock.price, activeStock.poa)}</span>}
          </div>

          <div className="mt-2 text-[13px] text-paper/70">
            {activeStock ? (
              <>
                {activeStock.condition} · {activeStock.status === "available" ? "In stock" : "On request"}
              </>
            ) : (
              "Not currently listed — enquire for availability."
            )}
          </div>

          <Link
            href={activeStock ? `/parts/${activeStock.slug}` : `/sell?part=${encodeURIComponent(active.label)}`}
            className="mt-3 inline-block text-[13px] font-semibold text-blueprint underline underline-offset-2"
          >
            {activeStock ? "View listing" : "Ask us about this part"}
          </Link>
        </div>
      )}
    </figure>
  );
}
