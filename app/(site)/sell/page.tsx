import type { Metadata } from "next";
import { SellForm } from "@/components/forms/sell-form";
import { getAllBrands } from "@/lib/data/taxonomy";

export const metadata: Metadata = {
  title: "Sell your equipment",
  description: "Sell marine diesel engines and spare parts to Shipcove Trading — 24 hour response.",
};

// Brands are admin-editable — never bake this into a static build.
export const dynamic = "force-dynamic";

const GUARANTEES = [
  { title: "Offer within 24 hours", detail: "Send the details and photos — we come back with a number the same business day, next day at the latest." },
  { title: "Always a fair offer", detail: "We price against what the unit will actually fetch, not a lowball opener." },
  { title: "We stand by our bid", detail: "Once we've made an offer, we honour it — no renegotiating after you've said yes." },
  { title: "Direct payment", detail: "Paid on collection, straight to you — no delays, no middlemen." },
  { title: "We arrange transport", detail: "Collection is on us — you don't have to organise freight." },
];

export default async function SellPage() {
  const brands = await getAllBrands();
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <span className="label text-steel">Sell to us</span>
      <h1 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">
        Tell us what you&apos;re decommissioning.
      </h1>
      <p className="mt-2 max-w-[60ch] text-[14px] text-steel">
        Brand, model, condition and a few photos — we&apos;ll come back with an offer within 24 hours.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <ol className="space-y-5">
          {GUARANTEES.map((g, i) => (
            <li key={g.title} className="flex gap-4">
              <span className="font-mono text-[13px] font-medium text-hull">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div className="text-[13px] font-semibold text-hull">{g.title}</div>
                <p className="mt-0.5 text-[13px] leading-relaxed text-steel">{g.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="rounded-sm border border-steel/15 bg-white p-6">
          <SellForm brands={brands} />
        </div>
      </div>
    </div>
  );
}
