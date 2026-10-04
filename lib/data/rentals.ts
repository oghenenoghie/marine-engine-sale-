// Rental is a separate line of business from the sale catalog (StockItem) —
// there's no inventory/availability backing these yet, so this is static
// content rather than a Supabase-backed table. Each page funnels into the
// same enquiry flow as everything else (see components/forms/enquiry-form.tsx).
export interface RentalCategory {
  slug: string;
  label: string;
  description: string;
  highlights: string[];
}

export const RENTAL_CATEGORIES: RentalCategory[] = [
  {
    slug: "ship",
    label: "Ship rental",
    description:
      "Charter workboats, tugs and crew transfer vessels for short-term operational needs — with or without crew.",
    highlights: [
      "Workboats, tugs and crew transfer vessels",
      "Bareboat or fully crewed charter",
      "Short-term and project-length terms",
      "Delivered ready to work, fuelled and certified",
    ],
  },
  {
    slug: "marine-equipment",
    label: "Marine equipment rental",
    description:
      "Generators, pumps, compressors and deck equipment for vessels and shore-side marine operations, available on short notice.",
    highlights: [
      "Generators, pumps and compressors",
      "Deck machinery and winches",
      "Welding and hot-work equipment",
      "Delivered to quay or vessel",
    ],
  },
  {
    slug: "dredger",
    label: "Dredger rental",
    description:
      "Cutter suction and trailing suction dredgers for port maintenance, land reclamation and channel deepening.",
    highlights: [
      "Cutter suction and trailing suction units",
      "Operator crews available on request",
      "Suited to port, channel and reclamation work",
      "Mobilisation handled end to end",
    ],
  },
  {
    slug: "pontoon",
    label: "Pontoon rental",
    description:
      "Modular steel pontoons for temporary jetties, work platforms and marine construction, sized to the job.",
    highlights: [
      "Modular sections, configurable to any layout",
      "Suited to jetties, work platforms and access",
      "Rated for vehicle and equipment loading",
      "Delivered and positioned on site",
    ],
  },
  {
    slug: "barge",
    label: "Barge rental",
    description: "Flat-top and split-hopper barges for cargo, construction and dredging support work.",
    highlights: [
      "Flat-top and split-hopper configurations",
      "Deck space for cargo and construction plant",
      "Inland and coastal use",
      "Available bareboat or with tug support",
    ],
  },
  {
    slug: "well-intervention-vessel",
    label: "Well intervention vessel rental",
    description:
      "Light and riser-based well intervention vessels with coiled tubing and pumping support for offshore well work.",
    highlights: [
      "Light well intervention vessels (LWIV)",
      "Riser-based intervention vessels",
      "Coiled tubing & pumping support",
      "Mobilisation handled end to end",
    ],
  },
  {
    slug: "jack-up-rig",
    label: "Jack-up rig rental",
    description:
      "Independent-leg, mat-supported and caisson-supported jack-up rigs for offshore drilling and construction work.",
    highlights: [
      "Independent-leg jack-ups",
      "Mat-supported jack-ups",
      "Caisson-supported jack-ups",
      "Operators available on request",
    ],
  },
  {
    slug: "workboat",
    label: "Workboat rental",
    description:
      "Multicats, pilot boats, PSVs, CTVs, fireboats, research boats and RIBs for offshore and nearshore support work.",
    highlights: ["Multicats & shoalbusters", "Pilot boats, PSVs & CTVs", "Fireboats & research boats", "RIBs"],
  },
  {
    slug: "tug",
    label: "Tug rental",
    description: "Harbor, river and ocean-going tugs, including anchor handling and salvage/fire-fighting capability.",
    highlights: ["Harbor/river tugs", "Ocean-going tugs", "Anchor handling tugs", "Salvage & fire-fighting"],
  },
  {
    slug: "crane",
    label: "Crane rental",
    description: "Mobile harbour cranes and floating crane barges for lifting, loading and marine construction work.",
    highlights: [
      "Mobile harbour cranes and floating crane barges",
      "Lifting capacities to suit quay and offshore work",
      "Operators available on request",
      "Flexible day, week and project rates",
    ],
  },
  {
    slug: "yacht",
    label: "Yacht rental",
    description: "Motor yachts available for charter, from day trips to extended cruising, with professional crew.",
    highlights: [
      "Motor yachts for day and extended charter",
      "Professional crew included",
      "Provisioning and itinerary planning on request",
      "Available across the season",
    ],
  },
];

export function rentalBySlug(slug: string): RentalCategory | undefined {
  return RENTAL_CATEGORIES.find((r) => r.slug === slug);
}
