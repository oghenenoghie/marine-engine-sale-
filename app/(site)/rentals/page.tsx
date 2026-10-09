import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ImageIcon } from "lucide-react";
import { RENTAL_CATEGORIES } from "@/lib/data/rentals";

export const metadata: Metadata = {
  title: "Rental fleet",
  description:
    "Charter well intervention vessels, jack-up rigs, dredgers, workboats, tugboats, barges, pontoons, tri-toon vessels and bunkering tankers from Shipcove Trading.",
};

export default function RentalsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <span className="label text-steel">Rental</span>
      <h1 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">Rental fleet</h1>
      <p className="mt-2 max-w-[60ch] text-[14px] text-steel">
        Vessels and equipment available for charter alongside our sale catalog — tell us the dates and job, and we&apos;ll
        come back with availability.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RENTAL_CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/rentals/${category.slug}`}
            className="group flex flex-col overflow-hidden rounded-sm border border-steel/15 bg-white transition-colors duration-200 hover:border-hull/40"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.drawingNote}
                  fill
                  unoptimized
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-steel/30">
                  <ImageIcon size={28} />
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="font-display text-lg font-bold text-hull">{category.label}</div>
                <ArrowRight
                  size={16}
                  className="mt-1 shrink-0 text-steel transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-hull"
                />
              </div>
              <p className="mt-1.5 text-[13px] text-steel">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
