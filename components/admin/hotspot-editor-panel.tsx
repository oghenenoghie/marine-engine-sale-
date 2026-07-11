"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { HotspotEditor } from "@/components/drawings/hotspot-editor";
import { saveDrawingHotspotsAction } from "@/lib/actions/stock";
import type { Drawing, StockItemView } from "@/types";

export function HotspotEditorPanel({ drawing, stockOptions }: { drawing: Drawing; stockOptions: StockItemView[] }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <HotspotEditor
        assetKey={drawing.assetKey}
        title={drawing.title}
        initialHotspots={drawing.hotspots}
        stockOptions={stockOptions}
        onSave={async (hotspots) => {
          setError(null);
          try {
            await saveDrawingHotspotsAction(drawing.id, hotspots);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save hotspots");
          }
        }}
      />
      {error && <p className="mt-3 text-[13px] text-signal">{error}</p>}
      {saved && (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-patina/10 px-4 py-2 text-[13px] text-patina">
          <Check size={16} /> Hotspots saved.
        </div>
      )}
    </div>
  );
}
