import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StockDetail } from "@/components/stock/stock-detail";
import { getAllStock, getStockBySlug } from "@/lib/data/stock";

export function generateStaticParams() {
  return getAllStock()
    .filter((i) => i.type === "part")
    .map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getStockBySlug(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: `${item.title} — ${item.condition}, SKU ${item.sku}. ${item.brand.name}${item.model ? ` ${item.model.name}` : ""}.`,
  };
}

export default async function PartDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getStockBySlug(slug);
  if (!item || item.type !== "part") notFound();
  return <StockDetail item={item} />;
}
