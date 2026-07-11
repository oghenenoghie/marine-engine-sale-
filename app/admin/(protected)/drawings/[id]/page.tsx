import { notFound } from "next/navigation";
import { HotspotEditorPanel } from "@/components/admin/hotspot-editor-panel";
import { getAllStock, getDrawing } from "@/lib/data/stock";

export default async function AdminDrawingEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const drawing = await getDrawing(id);
  if (!drawing) notFound();
  const stockOptions = await getAllStock();

  return (
    <div className="p-6">
      <h1 className="font-display text-xl font-extrabold tracking-tight text-hull">{drawing.title}</h1>
      <p className="text-[12px] text-steel">Click &ldquo;Add hotspot&rdquo;, then click on the drawing to place a callout.</p>
      <div className="mt-6">
        <HotspotEditorPanel drawing={drawing} stockOptions={stockOptions} />
      </div>
    </div>
  );
}
