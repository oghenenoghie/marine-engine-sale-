import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { BrandLogo } from "@/components/common/brand-logo";
import { FleetCategories } from "@/components/common/fleet-categories";
import { FleetHeroSlider, type FleetHeroSlide } from "@/components/common/fleet-hero-slider";
import { StockCard } from "@/components/stock/stock-card";
import { Button } from "@/components/ui/button";
import { getFeaturedStock } from "@/lib/data/stock";
import { getAllBrands } from "@/lib/data/taxonomy";
import { getHeroCopy, getHeroDrawings, getHeroImages } from "@/lib/data/settings";
import { RENTAL_CATEGORIES } from "@/lib/data/rentals";

// Stock/drawings are admin-editable — never bake this into a static build.
export const dynamic = "force-dynamic";

const firstSentence = (text: string) => text.match(/^.*?\.(?=\s|$)/)?.[0] ?? text;

// Every rental line with a drawing + tagline gets a slide after the admin-editable fleet slide below.
const RENTAL_SLIDES: FleetHeroSlide[] = RENTAL_CATEGORIES.flatMap((category) =>
  category.image && category.tagline
    ? [
        {
          id: category.slug,
          label: category.label,
          eyebrow: `Rental fleet · ${category.label}`,
          headline: category.tagline,
          body: firstSentence(category.description),
          primary: { href: `/rentals/${category.slug}`, label: `View ${category.label.toLowerCase()}` },
          secondary: { href: `/rentals/${category.slug}#request-availability`, label: "Request availability" },
          image: category.image,
        },
      ]
    : [],
);

export default async function HomePage() {
  const [featured, brands, heroCopy, heroDrawings, heroImages] = await Promise.all([
    getFeaturedStock(8),
    getAllBrands(),
    getHeroCopy(),
    getHeroDrawings(),
    getHeroImages(),
  ]);

  // Admin-editable (lib/data/settings.ts / the /admin dashboard's hero panels) — the one slide
  // every deployment has regardless of rental-category content, so editing it from /admin always
  // has a visible effect on the live homepage.
  const heroSlides: FleetHeroSlide[] = [
    {
      id: "fleet",
      label: "Marine diesel & rentals",
      eyebrow: heroCopy.eyebrow,
      headline: heroCopy.headline,
      body: heroCopy.paragraph,
      primary: { href: "/parts", label: "Browse parts" },
      secondary: { href: "/rentals#fleet", label: "Browse rental fleet" },
      drawings: heroDrawings,
    },
    ...RENTAL_SLIDES,
  ];

  return (
    <>
      {/* Hero — the sticky Header sits flush above this and doubles as its navbar. The first slide is
          admin-editable (/admin dashboard); each rental line with a drawing + tagline gets one after it. */}
      <FleetHeroSlider slides={heroSlides} heroImages={heroImages}>
        <FadeIn
          delay={0.15}
          className="grid max-w-xs grid-cols-2 gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-wider text-paper/50"
        >
          <span>Fleet</span>
          <span className="data text-paper/80">{RENTAL_CATEGORIES.length} categories</span>
          <span>Availability</span>
          <span className="data text-paper/80">On request</span>
          <span>Mobilisation</span>
          <span className="data text-paper/80">End to end</span>
          <span>Crew</span>
          <span className="data text-paper/80">Either</span>
        </FadeIn>
      </FleetHeroSlider>

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
