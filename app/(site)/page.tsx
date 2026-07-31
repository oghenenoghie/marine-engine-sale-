import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { DrawingReveal } from "@/components/motion/drawing-reveal";
import { InfiniteScroll } from "@/components/motion/infinite-scroll";
import { CategorySlider, type SliderCategory } from "@/components/motion/category-slider";
import { HeroSlider } from "@/components/motion/hero-slider";
import { BrandLogo } from "@/components/common/brand-logo";
import { ExplodedDrawing } from "@/components/drawings/exploded-drawing";
import { StockCard } from "@/components/stock/stock-card";
import { Button } from "@/components/ui/button";
import { getAllDrawings, getAllStock, getFeaturedStock } from "@/lib/data/stock";
import { getAllBrands } from "@/lib/data/taxonomy";
import { getHeroImages } from "@/lib/data/settings";

// Stock/drawings are admin-editable — never bake this into a static build.
export const dynamic = "force-dynamic";

const HERO_CATEGORIES: SliderCategory[] = [
  { label: "Ship engines", href: "/engines" },
  { label: "Ship spare parts", href: "/parts" },
  { label: "Marine parts", href: "/parts" },
  { label: "Ship rental", href: "/rentals/ship" },
  { label: "Marine equipment rental", href: "/rentals/marine-equipment" },
  { label: "Dredger rental", href: "/rentals/dredger" },
  { label: "Power plant", href: "/power-plants" },
  { label: "Gas turbines", href: "/gas-turbines" },
  { label: "Brands", href: "/brands" },
  { label: "Stock", href: "/stock" },
  { label: "Pontoon rental", href: "/rentals/pontoon" },
  { label: "Barge rental", href: "/rentals/barge" },
  { label: "Crane rental", href: "/rentals/crane" },
  { label: "Yacht rental", href: "/rentals/yacht" },
  { label: "Sell to us", href: "/sell" },
];

export default async function HomePage() {
  const [featured, drawings, allStock, brands, heroImages] = await Promise.all([
    getFeaturedStock(8),
    getAllDrawings(),
    getAllStock(),
    getAllBrands(),
    getHeroImages(),
  ]);
  const heroDrawing = drawings[0];
  const stockById = Object.fromEntries(allStock.map((s) => [s.id, s]));

  return (
    <>
      {/* Hero — the sticky Header sits flush above this and doubles as its navbar */}
      <section className="relative isolate overflow-hidden bg-hull text-paper">
        {heroImages.length > 0 && (
          <>
            <HeroSlider key={heroImages.join("|")} images={heroImages} />
            <div className="absolute inset-0 bg-hull/45" aria-hidden />
          </>
        )}
        {heroImages.length === 0 && (
          <>
            <div
              className="tech-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_35%,black,transparent)]"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
              <DrawingReveal className="h-[640px] w-[640px] text-paper/20" />
            </div>
          </>
        )}

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:py-32">
          <FadeIn className="flex flex-col items-center">
            <span className="label inline-flex items-center gap-2 border border-paper/20 px-4 py-1.5 text-paper/80">
              <span className="h-1 w-1 shrink-0 rounded-full bg-paper" aria-hidden />
              Marine diesel · engines &amp; parts
            </span>
            <h1 className="mt-5 text-display-xl font-display font-extrabold tracking-tight">
              Trading the fleet — engines, parts and power,{" "}
              <span className="border-b-2 border-paper/25 pb-0.5">across every major brand.</span>
            </h1>
            <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-paper/70">
              Shipcove Trading trades complete marine diesel engines and spare parts across Wärtsilä, MAN, MaK, Deutz and
              Caterpillar — searchable by OEM number, by model, and through interactive exploded diagrams that link
              straight to live stock.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
              Drawing-driven part discovery
            </span>
          </FadeIn>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-14 sm:pb-20">
          <FadeIn delay={0.1}>
            <div className="flex items-center justify-between gap-4 border-t border-paper/10 pt-8">
              <span className="label text-paper/50">Browse by category</span>
            </div>
            <CategorySlider categories={HERO_CATEGORIES} className="mt-5" />
          </FadeIn>
        </div>
      </section>

      {/* Brand marquee: horizontal infinite scroll */}
      {brands.length > 0 && (
        <section className="border-b border-steel/10 bg-white py-10">
          <div className="mx-auto max-w-7xl px-6">
            <span className="label text-steel">Brands we trade across</span>
          </div>
          <div className="mt-5">
            <InfiniteScroll speed="normal">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group flex h-full w-64 flex-col justify-center rounded-sm border border-steel/15 bg-paper px-5 py-4 transition-colors duration-200 hover:border-hull/40"
                >
                  <BrandLogo brand={brand} className="mb-2" />
                  <div className="font-display text-base font-bold text-hull">{brand.name}</div>
                  {brand.blurb && <p className="mt-1 line-clamp-2 text-[12px] text-steel">{brand.blurb}</p>}
                </Link>
              ))}
            </InfiniteScroll>
          </div>
        </section>
      )}

      {/* Signature: interactive exploded drawing */}
      {heroDrawing && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <FadeIn>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="label text-steel">Drawing-driven discovery</span>
                <h2 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">
                  Tap a callout, land on the part.
                </h2>
              </div>
              <Link
                href={`/drawings/${heroDrawing.slug}`}
                className="hidden shrink-0 text-[13px] font-semibold text-hull underline underline-offset-4 sm:block"
              >
                Open full diagram →
              </Link>
            </div>
            <ExplodedDrawing
              assetKey={heroDrawing.assetKey}
              title={heroDrawing.title}
              hotspots={heroDrawing.hotspots}
              stockById={stockById}
            />
          </FadeIn>
        </section>
      )}

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
