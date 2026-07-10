import { brands, modelsForBrand } from "@/lib/data/taxonomy";

export default function AdminBrandsPage() {
  return (
    <div className="p-6">
      <h1 className="font-display text-xl font-extrabold tracking-tight text-hull">Brands</h1>
      <p className="text-[12px] text-steel">Taxonomy reference — brand and model management ships with Supabase-backed CRUD.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {brands.map((brand) => (
          <div key={brand.id} className="rounded-md border border-steel/15 bg-white p-4">
            <div className="font-display text-base font-bold text-hull">{brand.name}</div>
            <p className="mt-1 text-[12px] text-steel">{brand.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {modelsForBrand(brand.id).map((m) => (
                <span key={m.id} className="rounded bg-blueprint/10 px-2 py-0.5 font-mono text-[11px] text-blueprint">
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
