import { StockDashboard } from "@/components/admin/stock-dashboard";
import { stockSeed } from "@/lib/data/stock.seed";
import { brands, engineModels, partCategories } from "@/lib/data/taxonomy";

export default function AdminStockPage() {
  return <StockDashboard initialItems={stockSeed} brands={brands} models={engineModels} categories={partCategories} />;
}
