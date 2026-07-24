import type { Metadata } from "next";
import { StockListing, type StockListingSearchParams } from "@/components/stock/stock-listing";

export const metadata: Metadata = {
  title: "Power plants",
  description: "Marine diesel power plant equipment for sale, inspected and documented.",
};

export default async function PowerPlantsPage({
  searchParams,
}: {
  searchParams: Promise<StockListingSearchParams>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-display-lg font-display font-bold tracking-tight text-hull">Power plants</h1>
      <p className="mt-2 max-w-[60ch] text-[14px] text-steel">
        Power plant equipment and packaged units, ready-to-run and decommissioned.
      </p>
      <div className="mt-8">
        <StockListing productCategory="power-plants" searchParams={params} emptyLabel="power plant item" />
      </div>
    </div>
  );
}
