import { StockDashboard } from "@/components/admin/stock-dashboard";
import { getAllStock } from "@/lib/data/stock";
import { getAllBrands, getAllCategories, getAllModels, getAllProductCategories } from "@/lib/data/taxonomy";

export const dynamic = "force-dynamic";

export default async function AdminStockPage() {
  const [items, brands, engineModels, partCategories, productCategories] = await Promise.all([
    getAllStock(),
    getAllBrands(),
    getAllModels(),
    getAllCategories(),
    getAllProductCategories(),
  ]);
  return (
    <StockDashboard
      initialItems={items}
      brands={brands}
      models={engineModels}
      categories={partCategories}
      productCategories={productCategories}
    />
  );
}
