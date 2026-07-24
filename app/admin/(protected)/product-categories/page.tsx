import { ProductCategoriesDashboard } from "@/components/admin/product-categories-dashboard";
import { getAllProductCategories } from "@/lib/data/taxonomy";

export const dynamic = "force-dynamic";

export default async function AdminProductCategoriesPage() {
  const categories = await getAllProductCategories();
  return (
    <div className="p-6">
      <ProductCategoriesDashboard initialCategories={categories} />
    </div>
  );
}
