import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExplodedDrawing } from "@/components/drawings/exploded-drawing";
import { getAllStock, getDrawing } from "@/lib/data/stock";
import { engineModels } from "@/lib/data/taxonomy";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const drawing = await getDrawing(id);
  if (!drawing) return {};
  return { title: drawing.title, description: `Interactive exploded diagram — ${drawing.title}.` };
}

export default async function DrawingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const drawing = await getDrawing(id);
  if (!drawing) notFound();

  const model = engineModels.find((m) => m.id === drawing.modelId);
  const allStock = await getAllStock();
  const stockById = Object.fromEntries(allStock.map((s) => [s.id, s]));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <span className="label text-blueprint">{model?.name}</span>
      <h1 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">{drawing.title}</h1>
      <p className="mt-2 text-[13px] text-steel">Tap a numbered callout to see the part, its condition, and whether it&apos;s in stock.</p>
      <div className="mt-6">
        <ExplodedDrawing assetKey={drawing.assetKey} title={drawing.title} hotspots={drawing.hotspots} stockById={stockById} />
      </div>
    </div>
  );
}
