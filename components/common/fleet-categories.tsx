import { FadeIn } from "@/components/motion/fade-in";
import { CategoryCard } from "@/components/common/category-card";
import { rentalIcon } from "@/components/common/rental-icons";
import { RENTAL_CATEGORIES } from "@/lib/data/rentals";

// Curated subset of RENTAL_CATEGORIES for the homepage — the offshore/technical
// fleet lines. The full set renders on /rentals (see that page).
const FEATURED_SLUGS = ["well-intervention-vessel", "jack-up-rig", "dredger", "pontoon", "workboat", "tug", "barge"];

const FEATURED_CATEGORIES = FEATURED_SLUGS.map((slug) => RENTAL_CATEGORIES.find((c) => c.slug === slug)).filter(
  (c): c is (typeof RENTAL_CATEGORIES)[number] => c !== undefined,
);

export function FleetCategories() {
  return (
    <section className="border-b border-steel/10 bg-paper py-16">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <span className="label text-steel">Our fleet</span>
          <h2 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">Equipment categories we trade</h2>
        </FadeIn>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_CATEGORIES.map((category, i) => (
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
    </section>
  );
}
