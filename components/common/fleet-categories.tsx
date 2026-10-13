import { FadeIn } from "@/components/motion/fade-in";
import { CategoryCard } from "@/components/common/category-card";
import { rentalIcon } from "@/components/common/rental-icons";
import { RENTAL_CATEGORIES } from "@/lib/data/rentals";

// Every rental line now has a drawing, so the homepage shows the full set — the same cards as
// /rentals. Rows wrap rather than sit in a grid, so a part-filled last row is centred.
const FEATURED_CATEGORIES = RENTAL_CATEGORIES;

export function FleetCategories() {
  return (
    <section className="border-b border-steel/10 bg-paper py-16">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <span className="label text-steel">Our fleet</span>
          <h2 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">Equipment categories we trade</h2>
        </FadeIn>
        <div className="mt-6 flex flex-wrap justify-center gap-4 [&>*]:w-full sm:[&>*]:w-[calc((100%-1rem)/2)] lg:[&>*]:w-[calc((100%-2rem)/3)]">
          {FEATURED_CATEGORIES.map((category, i) => (
            <FadeIn key={category.slug} delay={i * 0.04}>
              <CategoryCard
                href={`/rentals/${category.slug}`}
                icon={rentalIcon(category.slug)}
                image={category.image}
                label={category.label.replace(/ rental$/i, "")}
                highlights={category.applications}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
