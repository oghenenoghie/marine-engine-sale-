import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";

type IconProps = { className?: string };

function WellInterventionIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 17h20l-2 3H4l-2-3Z" />
      <path d="M12 17V4" />
      <path d="M10 4l2-2 2 2" />
      <path d="M9 7h6M9 10h6M9 13.5h6" />
    </svg>
  );
}

function JackUpRigIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 20h20" />
      <path d="M6 20V9M12 20V7M18 20V9" />
      <path d="M4 9h16" />
      <path d="M12 7V3" />
      <path d="M10 4.5h4" />
    </svg>
  );
}

function DredgerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 19l2 2h12l2-2-2-1H4l-2 1Z" />
      <path d="M5 18v-5h4v5" />
      <path d="M9 13l7-6 4 2" />
      <path d="M20 9l2 2-3 1.5-1-2.5Z" />
    </svg>
  );
}

function PontoonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="13" width="18" height="3.5" rx="0.5" />
      <path d="M5.5 13v-3M9.5 13v-3M13.5 13v-3M17.5 13v-3" />
      <path d="M5.5 10h12" />
      <path d="M2 20c2-1.3 4-1.3 6 0s4 1.3 6 0 4-1.3 6 0" />
    </svg>
  );
}

function WorkboatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 18l2 3h14l2-3" />
      <path d="M9 18v-5h6v5" />
      <path d="M12 13V9" />
      <circle cx="12" cy="7.5" r="1.1" />
    </svg>
  );
}

function TugIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 18l2 3h16l2-3-2-1.2H4L2 18Z" />
      <path d="M8 18v-7h8v7" />
      <path d="M13 11V8" />
      <path d="M4.5 18.5v-2.2M4.5 16.3h1.6M6.1 16.3v2.2" />
    </svg>
  );
}

function BargeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2.5" y="16.5" width="19" height="3" rx="0.5" />
      <rect x="8" y="10" width="8" height="6.5" />
      <path d="M2 21.5h20" />
    </svg>
  );
}

export interface FleetCategory {
  label: string;
  slug: string;
  icon: (props: IconProps) => JSX.Element;
  highlights: string[];
}

// slugs match lib/data/rentals.ts RENTAL_CATEGORIES — each card links to /rentals/[slug].
export const FLEET_CATEGORIES: FleetCategory[] = [
  {
    label: "Well intervention vessels",
    slug: "well-intervention-vessel",
    icon: WellInterventionIcon,
    highlights: ["Light well intervention vessels (LWIV)", "Riser-based intervention vessels", "Coiled tubing & pumping support"],
  },
  {
    label: "Jack-up rigs",
    slug: "jack-up-rig",
    icon: JackUpRigIcon,
    highlights: ["Independent-leg jack-ups", "Mat-supported jack-ups", "Caisson-supported jack-ups"],
  },
  {
    label: "Dredgers",
    slug: "dredger",
    icon: DredgerIcon,
    highlights: ["Backhoe dredger", "Grab/clamshell dredger", "Bucket dredger", "Dipper dredger"],
  },
  {
    label: "Pontoons",
    slug: "pontoon",
    icon: PontoonIcon,
    highlights: ["Traditional (bi-toon)", "Tri-toon", "Performance tri-toon"],
  },
  {
    label: "Workboats",
    slug: "workboat",
    icon: WorkboatIcon,
    highlights: ["Multicats & shoalbusters", "Pilot boats, PSVs & CTVs", "Fireboats & research boats", "RIBs"],
  },
  {
    label: "Tugs",
    slug: "tug",
    icon: TugIcon,
    highlights: ["Harbor/river tugs", "Ocean-going tugs", "Anchor handling tugs", "Salvage & fire-fighting"],
  },
  {
    label: "Barges",
    slug: "barge",
    icon: BargeIcon,
    highlights: ["Deck & hopper barges", "Dry bulk & liquid tank barges", "Crane/derrick barges", "Spud/jack-up barges"],
  },
];

export function FleetCategories() {
  return (
    <section className="border-b border-steel/10 bg-paper py-16">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <span className="label text-steel">Our fleet</span>
          <h2 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">Equipment categories we trade</h2>
        </FadeIn>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FLEET_CATEGORIES.map((category, i) => {
            const Icon = category.icon;
            return (
              <FadeIn key={category.label} delay={i * 0.04}>
                <Link
                  href={`/rentals/${category.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-sm border border-hull/15 bg-hull text-paper transition-colors duration-200 hover:border-paper/30"
                >
                  <div className="relative flex h-36 items-center justify-center border-b border-paper/10 p-6">
                    <Icon className="h-full w-full text-paper transition-transform duration-200 group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-hull from-40% to-transparent px-4 pb-2.5 pt-10">
                      <div className="font-display text-base font-bold tracking-tight">{category.label}</div>
                    </div>
                  </div>
                  <ul className="space-y-1 p-4">
                    {category.highlights.map((h) => (
                      <li key={h} className="flex gap-2 text-[12px] leading-relaxed text-paper/65">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-paper/50" aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
