import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, ImageIcon } from "lucide-react";
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

  const applications = category.applications ?? category.highlights;

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
      <p className="mt-2 max-w-[65ch] text-[14px] leading-relaxed text-steel">{category.description}</p>

      {(category.image || category.drawingNote) && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-sm border border-steel/15 bg-white">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.drawingNote ?? category.label}
              fill
              unoptimized
              className="object-contain p-4"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-steel/50">
              <ImageIcon size={32} />
              <p className="max-w-[40ch] text-[12px]">{category.drawingNote}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h2 className="label text-steel">{category.applications ? "Applications" : "Highlights"}</h2>
            <ul className="mt-3 space-y-2.5">
              {applications.map((a) => (
                <li key={a} className="flex items-start gap-2.5 text-[14px] text-hull">
                  <Check size={16} className="mt-0.5 shrink-0 text-steel" />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {category.configurations && category.configurations.length > 0 && (
            <div>
              <h2 className="label text-steel">Configurations</h2>
              <ul className="mt-3 space-y-4">
                {category.configurations.map((c) => (
                  <li key={c.name}>
                    <div className="text-[14px] font-semibold text-hull">{c.name}</div>
                    {c.description && <p className="mt-0.5 text-[13px] leading-relaxed text-steel">{c.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {category.configurations && (
            <div>
              <h2 className="label text-steel">Technical specifications</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-steel">
                Technical specifications and availability are provided upon request.
              </p>
            </div>
          )}
        </div>

        <div className="h-fit rounded-sm border border-steel/15 bg-white p-6">
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
