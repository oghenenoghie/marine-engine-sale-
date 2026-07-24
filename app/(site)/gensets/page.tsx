import type { Metadata } from "next";
import { StockListing, type StockListingSearchParams } from "@/components/stock/stock-listing";

export const metadata: Metadata = {
  title: "Gensets",
  description: "Marine diesel generator sets for sale, inspected and documented.",
};

export default async function GensetsPage({
  searchParams,
}: {
  searchParams: Promise<StockListingSearchParams>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-display-lg font-display font-bold tracking-tight text-hull">Gensets</h1>
      <p className="mt-2 max-w-[60ch] text-[14px] text-steel">
        Marine diesel generator sets, ready-to-run and decommissioned.
      </p>
      <div className="mt-8">
        <StockListing productCategory="gensets" searchParams={params} emptyLabel="genset" />
      </div>
    </div>
  );
}
