"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Hotspot, StockItemView } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HotspotEditorProps {
  assetKey: string;
  title: string;
  initialHotspots: Hotspot[];
  stockOptions: StockItemView[];
  onSave: (hotspots: Hotspot[]) => void;
}

export function HotspotEditor({ assetKey, title, initialHotspots, stockOptions, onSave }: HotspotEditorProps) {
  const [hotspots, setHotspots] = useState<Hotspot[]>(initialHotspots);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const selected = hotspots.find((h) => h.id === selectedId);

  const addHotspotAt = (x: number, y: number) => {
    const id = String(hotspots.length + 1).padStart(2, "0");
    const next: Hotspot = { id, x, y, label: "New callout", stockItemId: null, inStock: false };
    setHotspots((prev) => [...prev, next]);
    setSelectedId(id);
    setPlacing(false);
  };

  const updateSelected = (patch: Partial<Hotspot>) => {
    if (!selectedId) return;
    setHotspots((prev) => prev.map((h) => (h.id === selectedId ? { ...h, ...patch } : h)));
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setHotspots((prev) => prev.filter((h) => h.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="relative overflow-hidden rounded-md border border-steel/25 bg-hull">
        <div
          className={cn("relative aspect-[4/3] w-full", placing && "cursor-crosshair")}
          onClick={(e) => {
            if (!placing) return;
            const rect = e.currentTarget.getBoundingClientRect();
            addHotspotAt((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
          }}
        >
          <Image src={assetKey} alt={title} fill className="pointer-events-none object-contain" />
          {hotspots.map((h) => (
            <button
              key={h.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(h.id);
              }}
              style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
              className={cn(
                "absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border bg-paper/90 font-mono text-[11px] text-hull",
                h.id === selectedId ? "border-blueprint ring-2 ring-blueprint" : "border-steel/60",
              )}
            >
              {h.id}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-paper/10 p-3">
          <Button variant={placing ? "dark" : "outline"} size="sm" onClick={() => setPlacing((p) => !p)} className={!placing ? "bg-white" : undefined}>
            <Plus size={14} /> {placing ? "Click on drawing to place" : "Add hotspot"}
          </Button>
          <span className="data text-paper/50">{hotspots.length} hotspots</span>
        </div>
      </div>

      <div className="rounded-md border border-steel/15 bg-white p-4">
        {selected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="label text-steel">Callout {selected.id}</span>
              <button onClick={() => setSelectedId(null)} aria-label="Deselect" className="text-steel">
                <X size={14} />
              </button>
            </div>

            <div>
              <label className="label mb-1 block text-steel">Label</label>
              <Input value={selected.label} onChange={(e) => updateSelected({ label: e.target.value })} />
            </div>

            <div>
              <label className="label mb-1 block text-steel">Linked stock item</label>
              <select
                value={selected.stockItemId ?? ""}
                onChange={(e) => {
                  const stockItemId = e.target.value || null;
                  updateSelected({ stockItemId, inStock: !!stockItemId });
                }}
                className="w-full rounded-md border border-steel/25 bg-white px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-blueprint"
              >
                <option value="">— Not listed —</option>
                {stockOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sku} — {s.title}
                  </option>
                ))}
              </select>
            </div>

            <Button variant="outline" size="sm" onClick={removeSelected} className="w-full text-signal">
              <Trash2 size={14} /> Remove hotspot
            </Button>
          </div>
        ) : (
          <p className="text-[13px] text-steel">Select a hotspot to edit it, or add a new one on the drawing.</p>
        )}

        <div className="mt-6 border-t border-steel/10 pt-4">
          <Button className="w-full" onClick={() => onSave(hotspots)}>
            Save hotspots
          </Button>
        </div>
      </div>
    </div>
  );
}
