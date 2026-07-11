import { CategoriesDashboard } from "@/components/admin/categories-dashboard";
import { getAllCategories } from "@/lib/data/taxonomy";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();
  return (
    <div className="p-6">
      <CategoriesDashboard initialCategories={categories} />
    </div>
  );
}
