import { BrandsDashboard } from "@/components/admin/brands-dashboard";
import { getAllBrands, getAllModels } from "@/lib/data/taxonomy";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const [brands, models] = await Promise.all([getAllBrands(), getAllModels()]);
  return (
    <div className="p-6">
      <BrandsDashboard initialBrands={brands} initialModels={models} />
    </div>
  );
}
