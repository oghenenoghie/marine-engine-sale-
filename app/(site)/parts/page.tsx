import type { Metadata } from "next";
import { StockListing, type StockListingSearchParams } from "@/components/stock/stock-listing";

export const metadata: Metadata = {
  title: "Spare parts",
  description: "Search marine diesel spare parts by OEM number, brand, model or category.",
};

export default async function PartsPage({
  searchParams,
}: {
  searchParams: Promise<StockListingSearchParams>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-display-lg font-display font-bold tracking-tight text-hull">Spare parts</h1>
      <p className="mt-2 max-w-[60ch] text-[14px] text-steel">
        {params.q ? (
          <>
            Showing results for <span className="data text-hull">{params.q}</span>
          </>
        ) : (
          "Search by OEM part number, or filter by brand, model and condition."
        )}
      </p>
      <div className="mt-8">
        <StockListing type="part" searchParams={params} emptyLabel="part" />
      </div>
    </div>
  );
}
