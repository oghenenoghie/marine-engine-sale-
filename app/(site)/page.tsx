import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { BrandLogo } from "@/components/common/brand-logo";
import { FleetCategories } from "@/components/common/fleet-categories";
import { StockCard } from "@/components/stock/stock-card";
import { Button } from "@/components/ui/button";
import { getFeaturedStock } from "@/lib/data/stock";
import { getAllBrands } from "@/lib/data/taxonomy";
import { getHeroCopy } from "@/lib/data/settings";

// Stock/drawings are admin-editable — never bake this into a static build.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, brands, heroCopy] = await Promise.all([getFeaturedStock(8), getAllBrands(), getHeroCopy()]);

  return (
    <>
      {/* Hero — the sticky Header sits flush above this and doubles as its navbar */}
      <section className="relative isolate overflow-hidden bg-hull text-paper">
        <div
          className="tech-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_30%_40%,black,transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex h-48 items-end justify-end overflow-hidden opacity-30 sm:h-56 lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[60%] lg:items-center lg:justify-center lg:opacity-100"
          aria-hidden
        >
          <FadeIn className="w-[85%] lg:w-full" delay={0.1}>
            <Image
              src="/hero/well-intervention-vessel.png"
              alt=""
              width={1794}
              height={877}
              unoptimized
              priority
              className="w-full object-contain opacity-80 mix-blend-luminosity"
            />
          </FadeIn>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:py-20">
          <FadeIn className="max-w-xl">
            <span className="label inline-flex items-center gap-2 border border-paper/20 px-4 py-1.5 text-paper/80">
              <span className="h-1 w-1 shrink-0 rounded-full bg-paper" aria-hidden />
              {heroCopy.eyebrow}
            </span>
            <h1 className="mt-5 text-display-xl font-display font-extrabold tracking-tight">{heroCopy.headline}</h1>
            <p className="mt-5 max-w-[50ch] text-[13px] leading-relaxed text-paper/70">{heroCopy.paragraph}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="inverse" size="lg">
                <Link href="/parts">
                  Browse parts <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-paper/25 text-paper hover:bg-paper/10">
                <Link href="/sell">Sell your equipment</Link>
              </Button>
            </div>
            <span className="label mt-10 inline-flex items-center gap-2 border border-paper/15 px-4 py-1.5 text-paper/60">
              <span className="h-1 w-1 shrink-0 rounded-full bg-paper/60" aria-hidden />
              {heroCopy.tagline}
            </span>
          </FadeIn>
        </div>
      </section>

      {/* Fleet categories */}
      <FleetCategories />

      {/* Featured stock */}
      <section className="border-t border-steel/10 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="label text-steel">In stock</span>
                <h2 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">Featured listings</h2>
              </div>
              <Link href="/stock" className="shrink-0 text-[13px] font-semibold text-hull underline underline-offset-4">
                View all stock →
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.04}>
                <StockCard item={item} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="bg-paper py-16">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <span className="label text-steel">Brands</span>
            <h2 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">Trading across the fleet</h2>
          </FadeIn>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand, i) => (
              <FadeIn key={brand.id} delay={i * 0.04}>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="group block rounded-sm border border-steel/15 bg-white p-5 transition-colors duration-200 hover:border-hull/40"
                >
                  <BrandLogo brand={brand} className="mb-2" />
                  <div className="font-display text-base font-bold text-hull">{brand.name}</div>
                  <p className="mt-1 line-clamp-2 text-[12px] text-steel">{brand.blurb}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Sell-to-us CTA */}
      <section className="bg-hull py-16 text-paper">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="flex flex-col items-start justify-between gap-6 border border-paper/15 p-8 md:flex-row md:items-center">
            <div>
              <span className="label text-paper/60">Sell to us</span>
              <h2 className="mt-1 text-display-lg font-display font-bold tracking-tight">
                Decommissioning or upgrading? We buy engines and parts.
              </h2>
              <p className="mt-2 max-w-[60ch] text-[14px] text-paper/70">
                Tell us the brand, model and condition — we respond within 24 hours.
              </p>
            </div>
            <Button asChild variant="inverse" size="lg" className="shrink-0">
              <Link href="/sell">
                Start a sell enquiry <ArrowRight size={16} />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
