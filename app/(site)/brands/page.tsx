import type { Metadata } from "next";
import Link from "next/link";
import { getAllBrands } from "@/lib/data/taxonomy";

export const metadata: Metadata = {
  title: "Brands",
  description: "Browse marine diesel engine brands: Wärtsilä, MAN, MaK, Deutz, Caterpillar.",
};

// Brands are admin-editable — never bake this into a static build.
export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const brands = await getAllBrands();
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-display-lg font-display font-bold tracking-tight text-hull">Brands</h1>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="block rounded-md border border-steel/15 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="font-display text-lg font-bold text-hull">{brand.name}</div>
            <p className="mt-1.5 text-[13px] text-steel">{brand.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
