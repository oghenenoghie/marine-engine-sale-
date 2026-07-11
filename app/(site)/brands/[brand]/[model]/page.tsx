import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StockCard } from "@/components/stock/stock-card";
import { brandBySlug, getAllBrands, getAllModels, modelBySlug } from "@/lib/data/taxonomy";
import { getDrawingsForModel, getStock } from "@/lib/data/stock";

// Brands/models are admin-editable — never bake this into a static build.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}): Promise<Metadata> {
  const { brand: brandSlug, model: modelSlug } = await params;
  const [brands, models] = await Promise.all([getAllBrands(), getAllModels()]);
  const brand = brandBySlug(brands, brandSlug);
  const model = modelBySlug(models, modelSlug);
  if (!brand || !model) return {};
  return { title: `${brand.name} ${model.name}`, description: `${brand.name} ${model.name} — drawings, specs and parts in stock.` };
}

export default async function ModelPage({ params }: { params: Promise<{ brand: string; model: string }> }) {
  const { brand: brandSlug, model: modelSlug } = await params;
  const [brands, engineModels] = await Promise.all([getAllBrands(), getAllModels()]);
  const brand = brandBySlug(brands, brandSlug);
  const model = engineModels.find((m) => m.slug === modelSlug && m.brandId === brand?.id);
  if (!brand || !model) notFound();

  const drawings = await getDrawingsForModel(model.id);
  const items = await getStock({ model: model.slug });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="mb-4 text-[12px] text-steel">
        <Link href={`/brands/${brand.slug}`} className="hover:text-hull">
          {brand.name}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-hull">{model.name}</span>
      </nav>

      <h1 className="text-display-lg font-display font-bold tracking-tight text-hull">
        {brand.name} {model.name}
      </h1>

      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["Bore", model.bore],
          ["Stroke", model.stroke],
          ["Configuration", model.config],
          ["Power range", model.powerRange],
        ]
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k}>
              <dt className="label text-steel">{k}</dt>
              <dd className="data mt-0.5 text-hull">{v}</dd>
            </div>
          ))}
      </dl>

      {drawings.length > 0 && (
        <div className="mt-10">
          <div className="label mb-3 text-steel">Exploded drawings</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {drawings.map((d) => (
              <Link
                key={d.id}
                href={`/drawings/${d.slug}`}
                className="rounded-md border border-steel/15 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="font-display text-sm font-bold text-hull">{d.title}</div>
                <div className="data mt-1 text-steel">{d.hotspots.length} callouts</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <div className="label mb-3 text-steel">Parts in stock</div>
        {items.length === 0 ? (
          <p className="text-[13px] text-steel">No {model.name} parts listed right now.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <StockCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
