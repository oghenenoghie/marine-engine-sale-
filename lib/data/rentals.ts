// Rental is a separate line of business from the sale catalog (StockItem) —
// there's no inventory/availability backing these yet, so this is static
// content rather than a Supabase-backed table. Each page funnels into the
// same enquiry flow as everything else (see components/forms/enquiry-form.tsx).
export interface RentalConfiguration {
  name: string;
  description?: string;
}

export interface RentalCategory {
  slug: string;
  label: string;
  description: string;
  highlights: string[];
  /** Richer subcategory breakdown for the detail page — falls back to `highlights` when absent. */
  configurations?: RentalConfiguration[];
  /** Typical use cases for the detail page — falls back to `highlights` when absent. */
  applications?: string[];
  /** What the technical drawing depicts — shown as a caption when no image is available yet. */
  drawingNote?: string;
  /** Path under /public, when a drawing has been supplied for this category. */
  image?: string;
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
      "Dredging equipment supports marine excavation, sediment removal, seabed preparation, and waterway maintenance projects. Equipment selection depends on soil conditions, working depth, material type, access restrictions, and required production capacity.",
    highlights: [
      "Cutter suction and trailing suction units",
      "Operator crews available on request",
      "Suited to port, channel and reclamation work",
      "Mobilisation handled end to end",
    ],
    configurations: [
      { name: "Backhoe Dredgers", description: "Excavator-equipped platforms for precise excavation in ports, harbors, and confined marine environments." },
      { name: "Grab or Clamshell Dredgers", description: "Designed for lifting and removing sediment, debris, and bulk material using a grab bucket." },
      { name: "Bucket Dredgers", description: "Suitable for continuous excavation of selected seabed materials using bucket-based systems." },
      { name: "Dipper Dredgers", description: "Heavy-duty excavation equipment for demanding dredging and marine construction projects." },
    ],
    applications: ["Port development", "Harbor deepening", "Channel maintenance", "Reclamation", "Seabed preparation"],
    drawingNote: "Dredging hull, excavator or boom, grab bucket, lifting cables, deck machinery, and dredging equipment.",
  },
  {
    slug: "pontoon",
    label: "Pontoon rental",
    description:
      "Work pontoons provide floating platforms for marine construction, maintenance, and operations in locations where stable access from land is limited. Their modular or rectangular configurations can accommodate selected equipment, tools, temporary working areas, and project materials, subject to rated capacity and stability requirements.",
    highlights: [
      "Modular sections, configurable to any layout",
      "Suited to jetties, work platforms and access",
      "Rated for vehicle and equipment loading",
      "Delivered and positioned on site",
    ],
    applications: ["Bridge construction", "Quay maintenance", "Piling operations", "Nearshore works", "Dredging support", "Temporary marine work platforms"],
    drawingNote: "Rectangular floating platform, reinforced edges, flat deck, modular sections, access ladders, mooring points, and optional mounted cranes.",
  },
  {
    slug: "barge",
    label: "Barge rental",
    description:
      "Barges provide flexible deck and cargo capacity for transporting heavy equipment, construction materials, project cargo, and offshore supplies. Available configurations can be matched to project requirements based on deck loading, dimensions, draft, stability, towing arrangements, and operating conditions.",
    highlights: [
      "Flat-top and split-hopper configurations",
      "Deck space for cargo and construction plant",
      "Inland and coastal use",
      "Available bareboat or with tug support",
    ],
    configurations: [
      { name: "Flat-Deck Barges", description: "General cargo, equipment transportation, and offshore construction support." },
      { name: "Derrick Barges", description: "Heavy-lifting operations for marine construction, installation, and removal." },
      { name: "Cargo Barges", description: "Transportation of bulk materials, containers, and project cargo." },
      { name: "Specialized Work Barges", description: "Platforms configured for marine construction, maintenance, and industrial support." },
    ],
    applications: ["Offshore construction", "Heavy equipment transportation", "Bridge works", "Port development", "Marine infrastructure projects"],
    drawingNote: "Long rectangular hull, broad open deck, towing fittings, deck cranes where applicable, cargo arrangements, bollards, and fenders.",
  },
  {
    slug: "well-intervention-vessel",
    label: "Well intervention vessel rental",
    description:
      "Specialized well intervention vessels designed to support offshore well maintenance, well integrity operations, and subsea intervention campaigns. These vessels provide dedicated deck space, offshore support systems, and operational capabilities for servicing subsea wells while helping operators optimize production and extend well life.",
    highlights: [
      "Light well intervention vessels (LWIV)",
      "Riser-based intervention vessels",
      "Coiled tubing & pumping support",
      "Mobilisation handled end to end",
    ],
    configurations: [
      { name: "Light Well Intervention Vessels (LWIV)", description: "Suitable for subsea well maintenance, inspection, wireline operations, and light intervention campaigns." },
      { name: "Riser-Based Intervention Vessels", description: "Designed to support intervention activities requiring riser systems and specialized subsea access equipment." },
      { name: "Coiled Tubing and Pumping Support Vessels", description: "Configured to support coiled tubing operations, pumping services, fluid handling, and related offshore well intervention activities." },
    ],
    applications: ["Offshore well servicing", "Subsea maintenance", "Well integrity programs", "Production optimization"],
    drawingNote: "Offshore vessel hull, aft accommodation, intervention tower or intervention equipment, deck piping, crane, and subsea support equipment.",
    image: "/rentals/well-intervention-vessels.webp",
  },
  {
    slug: "jack-up-rig",
    label: "Jack-up rig rental",
    description:
      "Jack-up units provide stable offshore working platforms for operations requiring a secure working environment in suitable water depths. Using extendable legs lowered to the seabed, these units elevate the main platform above the water surface to support drilling, maintenance, construction, and other offshore activities.",
    highlights: [
      "Independent-leg jack-ups",
      "Mat-supported jack-ups",
      "Caisson-supported jack-ups",
      "Operators available on request",
    ],
    configurations: [
      { name: "Independent-leg units" },
      { name: "Mat-supported units" },
      { name: "Caisson-supported units" },
    ],
    applications: ["Offshore drilling", "Platform maintenance", "Construction support", "Inspection", "Well servicing"],
    drawingNote: "Elevated platform, lattice legs, seabed footings, drilling derrick, deck cranes, accommodation block, and deck equipment.",
    image: "/rentals/jack-up-rigs.webp",
  },
  {
    slug: "workboat",
    label: "Workboat rental",
    description:
      "Versatile workboats provide practical marine support for offshore installations, coastal operations, port activities, and marine construction projects. Their adaptable configurations make them suitable for transporting personnel, moving equipment, conducting inspections, and supporting offshore logistics.",
    highlights: ["Multicats & shoalbusters", "Pilot boats, PSVs & CTVs", "Fireboats & research boats", "RIBs"],
    configurations: [
      { name: "Multicats and Shoalbusters", description: "Towing, anchor handling, pushing, and shallow-water support." },
      { name: "Pilot Boats", description: "Pilot transfers and port navigation support." },
      { name: "Platform Supply Vessels (PSVs)", description: "Transportation of supplies, equipment, and project materials to offshore installations." },
      { name: "Crew Transfer Vessels (CTVs)", description: "Personnel transfers between shore bases and offshore facilities." },
      { name: "Fireboats", description: "Marine firefighting and emergency response support." },
      { name: "Research and Survey Boats", description: "Hydrographic surveys, marine data collection, and inspection." },
      { name: "Rigid Inflatable Boats (RIBs)", description: "Rapid personnel transfers, patrols, and nearshore support." },
    ],
    applications: ["Offshore logistics", "Personnel transfers", "Marine construction", "Survey operations", "Port support"],
    drawingNote: "Compact marine hull, wheelhouse, work deck, fenders, mast, and crane where appropriate.",
    image: "/rentals/workboats.webp",
  },
  {
    slug: "tug",
    label: "Tug rental",
    description:
      "Tugboats provide maneuvering, towing, and vessel-assistance services for ports, terminals, offshore facilities, and marine construction projects. Configurations vary by bollard pull, propulsion arrangement, towing equipment, and operating environment to accommodate different vessel sizes and project requirements.",
    highlights: ["Harbor/river tugs", "Ocean-going tugs", "Anchor handling tugs", "Salvage & fire-fighting"],
    applications: ["Port operations", "Vessel escort", "Barge transportation", "Offshore towing", "Marine construction support"],
    drawingNote: "Compact heavy-duty hull, raised wheelhouse, towing winch, towing hook, bollards, fenders, and exhaust stacks.",
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
