import type { Metadata } from "next";
import { StockListing, type StockListingSearchParams } from "@/components/stock/stock-listing";

export const metadata: Metadata = {
  title: "Complete engines",
  description: "Complete marine diesel engines for sale — Wärtsilä, MAN, MaK, Deutz, Caterpillar.",
};

export default async function EnginesPage({
  searchParams,
}: {
  searchParams: Promise<StockListingSearchParams>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-display-lg font-display font-bold tracking-tight text-hull">Complete engines</h1>
      <p className="mt-2 max-w-[60ch] text-[14px] text-steel">
        Ready-to-run and decommissioned marine diesel engines, inspected and documented.
      </p>
      <div className="mt-8">
        <StockListing type="engine" searchParams={params} emptyLabel="engine" />
      </div>
    </div>
  );
}
