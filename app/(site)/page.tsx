import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { DrawingReveal } from "@/components/motion/drawing-reveal";
import { ExplodedDrawing } from "@/components/drawings/exploded-drawing";
import { StockCard } from "@/components/stock/stock-card";
import { Button } from "@/components/ui/button";
import { getAllDrawings, getAllStock, getFeaturedStock } from "@/lib/data/stock";
import { getAllBrands } from "@/lib/data/taxonomy";

// Stock/drawings are admin-editable — never bake this into a static build.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, drawings, allStock, brands] = await Promise.all([
    getFeaturedStock(8),
    getAllDrawings(),
    getAllStock(),
    getAllBrands(),
  ]);
  const heroDrawing = drawings[0];
  const stockById = Object.fromEntries(allStock.map((s) => [s.id, s]));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hull text-paper">
        <div className="blueprint-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <FadeIn className="flex flex-col justify-center">
            <span className="label text-signal">Marine diesel · engines &amp; parts</span>
            <h1 className="mt-3 text-display-xl font-display font-extrabold tracking-tight">
              Find the part by pointing at the drawing.
            </h1>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-paper/70">
              Drydock trades complete marine diesel engines and spare parts across Wärtsilä, MAN, MaK, Deutz and
              Caterpillar — searchable by OEM number, by model, and through interactive exploded diagrams that link
              straight to live stock.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/parts">
                  Browse parts <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-paper/25 text-paper hover:bg-paper/10">
                <Link href="/sell">Sell your equipment</Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="relative hidden items-center justify-center lg:flex">
            <DrawingReveal className="h-full w-full max-w-md text-blueprint" />
          </FadeIn>
        </div>
      </section>

      {/* Signature: interactive exploded drawing */}
      {heroDrawing && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <FadeIn>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="label text-blueprint">Drawing-driven discovery</span>
                <h2 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">
                  Tap a callout, land on the part.
                </h2>
              </div>
              <Link href={`/drawings/${heroDrawing.slug}`} className="hidden text-[13px] font-semibold text-blueprint sm:block">
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
                <span className="label text-blueprint">In stock</span>
                <h2 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">Featured listings</h2>
              </div>
              <Link href="/stock" className="text-[13px] font-semibold text-blueprint">
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
            <span className="label text-blueprint">Brands</span>
            <h2 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">Trading across the fleet</h2>
          </FadeIn>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand, i) => (
              <FadeIn key={brand.id} delay={i * 0.04}>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="block rounded-md border border-steel/15 bg-white p-5 transition-shadow hover:shadow-md"
                >
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
          <FadeIn className="flex flex-col items-start justify-between gap-6 rounded-md border border-paper/10 bg-paper/5 p-8 md:flex-row md:items-center">
            <div>
              <span className="label text-signal">Sell to us</span>
              <h2 className="mt-1 text-display-lg font-display font-bold tracking-tight">
                Decommissioning or upgrading? We buy engines and parts.
              </h2>
              <p className="mt-2 max-w-[60ch] text-[14px] text-paper/70">
                Tell us the brand, model and condition — we respond within 24 hours.
              </p>
            </div>
            <Button asChild size="lg">
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
