import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { RENTAL_CATEGORIES, rentalBySlug } from "@/lib/data/rentals";

export function generateStaticParams() {
  return RENTAL_CATEGORIES.map((category) => ({ type: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const category = rentalBySlug(type);
  if (!category) return {};
  return { title: category.label, description: category.description };
}

export default async function RentalCategoryPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const category = rentalBySlug(type);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <nav className="mb-4 text-[12px] text-steel">
        <Link href="/rentals" className="hover:text-hull">
          Rental
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-hull">{category.label}</span>
      </nav>

      <h1 className="text-display-lg font-display font-bold tracking-tight text-hull">{category.label}</h1>
      <p className="mt-2 max-w-[60ch] text-[14px] text-steel">{category.description}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <ul className="space-y-3">
          {category.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 text-[14px] text-hull">
              <Check size={16} className="mt-0.5 shrink-0 text-steel" />
              {h}
            </li>
          ))}
        </ul>

        <div className="rounded-sm border border-steel/15 bg-white p-6">
          <h2 className="font-display text-base font-bold text-hull">Request availability</h2>
          <p className="mt-1 text-[13px] text-steel">
            Tell us the dates and job — we&apos;ll come back with availability and a quote.
          </p>
          <EnquiryForm type="rfq" stockTitle={`${category.label} — availability request`} className="mt-4" />
        </div>
      </div>
    </div>
  );
}
