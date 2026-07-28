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
          const result = await saveDrawingHotspotsAction(drawing.id, hotspots);
          if (result.ok) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          } else {
            setError(result.error);
          }
        }}
      />
      {error && <p className="mt-3 text-[13px] font-medium text-hull">{error}</p>}
      {saved && (
        <div className="mt-3 flex items-center gap-2 rounded-sm border border-hull/20 bg-hull/[0.03] px-4 py-2 text-[13px] font-medium text-hull">
          <Check size={16} /> Hotspots saved.
        </div>
      )}
    </div>
  );
}
