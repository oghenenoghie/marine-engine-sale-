import type { Metadata } from "next";
import { SellForm } from "@/components/forms/sell-form";
import { getAllBrands } from "@/lib/data/taxonomy";

export const metadata: Metadata = {
  title: "Sell your equipment",
  description: "Sell marine diesel engines and spare parts to Drydock — 24 hour response.",
};

// Brands are admin-editable — never bake this into a static build.
export const dynamic = "force-dynamic";

export default async function SellPage() {
  const brands = await getAllBrands();
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <span className="label text-signal">Sell to us</span>
      <h1 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">
        Tell us what you&apos;re decommissioning.
      </h1>
      <p className="mt-2 text-[14px] text-steel">
        Brand, model, condition and a few photos — we&apos;ll come back with an offer within 24 hours.
      </p>
      <div className="mt-8 rounded-md border border-steel/15 bg-white p-6">
        <SellForm brands={brands} />
      </div>
    </div>
  );
}
