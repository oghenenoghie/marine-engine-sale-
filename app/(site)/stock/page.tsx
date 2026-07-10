import type { Metadata } from "next";
import { StockListing, type StockListingSearchParams } from "@/components/stock/stock-listing";

export const metadata: Metadata = {
  title: "New & expected stock",
  description: "Recently arrived and expected marine engines and parts.",
};

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<StockListingSearchParams>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-display-lg font-display font-bold tracking-tight text-hull">New &amp; expected stock</h1>
      <p className="mt-2 max-w-[60ch] text-[14px] text-steel">Everything currently listed, including incoming stock.</p>
      <div className="mt-8">
        <StockListing searchParams={params} emptyLabel="item" />
      </div>
    </div>
  );
}
