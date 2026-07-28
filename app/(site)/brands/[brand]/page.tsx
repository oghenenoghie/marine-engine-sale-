import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StockCard } from "@/components/stock/stock-card";
import { BrandLogo } from "@/components/common/brand-logo";
import { brandBySlug, getAllBrands, getAllModels, modelsForBrand } from "@/lib/data/taxonomy";
import { getStock } from "@/lib/data/stock";

// Brands/models are admin-editable — never bake this into a static build.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brands = await getAllBrands();
  const brand = brandBySlug(brands, brandSlug);
  if (!brand) return {};
  return { title: brand.name, description: brand.blurb };
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  const [brands, allModels] = await Promise.all([getAllBrands(), getAllModels()]);
  const brand = brandBySlug(brands, brandSlug);
  if (!brand) notFound();

  const models = modelsForBrand(allModels, brand.id);
  const items = await getStock({ brand: brand.slug });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <span className="label text-steel">Brand</span>
      <BrandLogo brand={brand} muted={false} className="mt-2 h-12 w-48" />
      <h1 className="mt-3 text-display-lg font-display font-bold tracking-tight text-hull">{brand.name}</h1>
      <p className="mt-2 max-w-[60ch] text-[14px] text-steel">{brand.blurb}</p>

      {models.length > 0 && (
        <div className="mt-8">
          <div className="label mb-3 text-steel">Models</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {models.map((model) => (
              <Link
                key={model.id}
                href={`/brands/${brand.slug}/${model.slug}`}
                className="rounded-sm border border-steel/15 bg-white p-4 transition-colors duration-200 hover:border-hull/40"
              >
                <div className="font-display text-sm font-bold text-hull">{model.name}</div>
                <div className="data mt-1 text-steel">{model.powerRange}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <div className="label mb-3 text-steel">Stock</div>
        {items.length === 0 ? (
          <p className="text-[13px] text-steel">No {brand.name} stock listed right now.</p>
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
