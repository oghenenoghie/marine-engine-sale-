"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { HotspotEditor } from "@/components/drawings/hotspot-editor";
import type { Drawing, StockItemView } from "@/types";

export function HotspotEditorPanel({ drawing, stockOptions }: { drawing: Drawing; stockOptions: StockItemView[] }) {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <HotspotEditor
        assetKey={drawing.assetKey}
        title={drawing.title}
        initialHotspots={drawing.hotspots}
        stockOptions={stockOptions}
        onSave={(hotspots) => {
          // TODO: persist via Supabase — update drawings.hotspots for drawing.id.
          console.log("Saved hotspots for", drawing.id, hotspots);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
      />
      {saved && (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-patina/10 px-4 py-2 text-[13px] text-patina">
          <Check size={16} /> Hotspots saved.
        </div>
      )}
    </div>
  );
}
