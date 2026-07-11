import { StockDashboard } from "@/components/admin/stock-dashboard";
import { getAllStock } from "@/lib/data/stock";
import { getAllBrands, getAllCategories, getAllModels } from "@/lib/data/taxonomy";

export const dynamic = "force-dynamic";

export default async function AdminStockPage() {
  const [items, brands, engineModels, partCategories] = await Promise.all([
    getAllStock(),
    getAllBrands(),
    getAllModels(),
    getAllCategories(),
  ]);
  return <StockDashboard initialItems={items} brands={brands} models={engineModels} categories={partCategories} />;
}
