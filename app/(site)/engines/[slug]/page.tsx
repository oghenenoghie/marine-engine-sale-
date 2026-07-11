import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StockDetail } from "@/components/stock/stock-detail";
import { getStockBySlug } from "@/lib/data/stock";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getStockBySlug(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: `${item.title} — ${item.condition}, SKU ${item.sku}. ${item.brand.name}${item.model ? ` ${item.model.name}` : ""}.`,
  };
}

export default async function EngineDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getStockBySlug(slug);
  if (!item || item.type !== "engine") notFound();
  return <StockDetail item={item} />;
}
