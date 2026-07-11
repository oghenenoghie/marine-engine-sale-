import { StockDashboard } from "@/components/admin/stock-dashboard";
import { getAllStock } from "@/lib/data/stock";
import { brands, engineModels, partCategories } from "@/lib/data/taxonomy";

export const dynamic = "force-dynamic";

export default async function AdminStockPage() {
  const items = await getAllStock();
  return <StockDashboard initialItems={items} brands={brands} models={engineModels} categories={partCategories} />;
}
