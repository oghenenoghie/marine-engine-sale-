import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { VesselReveal } from "@/components/motion/vessel-reveal";
import { CategoryCard } from "@/components/common/category-card";
import { rentalIcon } from "@/components/common/rental-icons";
import { Button } from "@/components/ui/button";
import { RENTAL_CATEGORIES } from "@/lib/data/rentals";

export const metadata: Metadata = {
  title: "Rental fleet",
  description: "Charter ships, marine equipment, dredgers, pontoons, barges, cranes and yachts from Shipcove Trading.",
};

export default function RentalsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-hull text-paper">
        <div
          className="tech-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_30%_40%,black,transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex h-48 items-end justify-end overflow-hidden opacity-30 sm:h-56 lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[55%] lg:items-center lg:justify-center lg:opacity-100"
          aria-hidden
        >
          <VesselReveal className="w-[85%] text-paper/25 lg:w-full" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:py-20">
          <FadeIn className="max-w-xl">
            <span className="label inline-flex items-center gap-2 border border-paper/20 px-4 py-1.5 text-paper/80">
              <span className="h-1 w-1 shrink-0 rounded-full bg-paper" aria-hidden />
              Marine rental · vessel &amp; equipment charter
            </span>
            <h1 className="mt-5 text-display-xl font-display font-extrabold uppercase leading-[0.95] tracking-tight">
              Charter without limits.
            </h1>
            <p className="mt-5 max-w-[50ch] text-[13px] leading-relaxed text-paper/70">
              Specialized vessels and marine equipment for offshore operations, intervention, construction and heavy
              logistics — tell us the dates and job, and we&apos;ll come back with availability.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="inverse" size="lg">
                <Link href="#fleet">
                  Browse rental fleet <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-paper/25 text-paper hover:bg-paper/10">
                <Link href="/contact">Request availability</Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-16 grid max-w-xs grid-cols-2 gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-wider text-paper/50 sm:mt-24">
            <span>Fleet</span>
            <span className="data text-paper/80">{RENTAL_CATEGORIES.length} categories</span>
            <span>Availability</span>
            <span className="data text-paper/80">On request</span>
            <span>Mobilisation</span>
            <span className="data text-paper/80">End to end</span>
            <span>Crew</span>
            <span className="data text-paper/80">Either</span>
          </FadeIn>
        </div>
      </section>

      <div id="fleet" className="mx-auto max-w-7xl px-6 py-10 scroll-mt-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RENTAL_CATEGORIES.map((category, i) => (
            <FadeIn key={category.slug} delay={i * 0.04}>
              <CategoryCard
                href={`/rentals/${category.slug}`}
                icon={rentalIcon(category.slug)}
                label={category.label.replace(/ rental$/i, "")}
                highlights={category.highlights}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}
