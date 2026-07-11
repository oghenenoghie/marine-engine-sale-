import Link from "next/link";
import { Gallery } from "@/components/stock/gallery";
import { SpecTable } from "@/components/stock/spec-table";
import { StatusBadge } from "@/components/stock/status-badge";
import { ExplodedDrawing } from "@/components/drawings/exploded-drawing";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { formatPrice } from "@/lib/utils";
import { getAllStock, getDrawing } from "@/lib/data/stock";
import type { StockItemView } from "@/types";

export async function StockDetail({ item }: { item: StockItemView }) {
  const drawing = item.drawingId ? await getDrawing(item.drawingId) : undefined;
  const stockById = drawing ? Object.fromEntries((await getAllStock()).map((s) => [s.id, s])) : {};

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="mb-6 text-[12px] text-steel">
        <Link href={item.type === "engine" ? "/engines" : "/parts"} className="hover:text-hull">
          {item.type === "engine" ? "Engines" : "Parts"}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-hull">{item.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Gallery images={item.images} title={item.title} />
        </div>

        <div>
          <div className="label text-blueprint">
            {item.brand.name} {item.model ? `· ${item.model.name}` : ""}
          </div>
          <h1 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">{item.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusBadge status={item.status} />
            <span className="data text-steel">{item.sku}</span>
            <span className="text-[13px] text-steel">{item.condition}</span>
          </div>

          <div className="mt-5 font-display text-2xl font-extrabold text-hull">{formatPrice(item.price, item.poa)}</div>

          {item.description && <p className="mt-4 text-[14px] leading-relaxed text-steel">{item.description}</p>}

          {item.oemNumbers.length > 0 && (
            <div className="mt-5">
              <div className="label text-steel">OEM numbers</div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {item.oemNumbers.map((n) => (
                  <span key={n} className="data rounded bg-blueprint/10 px-2 py-0.5 text-blueprint">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="label mb-2 text-steel">Specifications</div>
            <SpecTable specs={item.specs} />
          </div>

          <div className="mt-8 rounded-md border border-steel/15 bg-white p-5">
            <h2 className="font-display text-base font-bold text-hull">Request a quote</h2>
            <p className="mt-1 text-[13px] text-steel">Most trades are POA — send an enquiry and we&apos;ll respond promptly.</p>
            <EnquiryForm type="rfq" stockItemId={item.id} stockTitle={item.title} className="mt-4" />
          </div>
        </div>
      </div>

      {drawing && (
        <div className="mt-16">
          <div className="label text-blueprint">Where this part sits</div>
          <h2 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">{drawing.title}</h2>
          <div className="mt-5">
            <ExplodedDrawing assetKey={drawing.assetKey} title={drawing.title} hotspots={drawing.hotspots} stockById={stockById} />
          </div>
        </div>
      )}
    </div>
  );
}
