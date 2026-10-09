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
  configurations: RentalConfiguration[];
  applications: string[];
  /** What the technical drawing depicts — used as the image's alt text, and as a caption when no image is available yet. */
  drawingNote: string;
  /** Path under /public, when a drawing has been supplied for this category. */
  image?: string;
}

export const RENTAL_CATEGORIES: RentalCategory[] = [
  {
    slug: "well-intervention-vessels",
    label: "Well Intervention Vessels",
    description:
      "Specialized well intervention vessels designed to support offshore well maintenance, well integrity operations, and subsea intervention campaigns. These vessels provide dedicated deck space, offshore support systems, and operational capabilities for servicing subsea wells while helping operators optimize production and extend well life.",
    configurations: [
      {
        name: "Light Well Intervention Vessels (LWIV)",
        description: "Suitable for subsea well maintenance, inspection, wireline operations, and light intervention campaigns.",
      },
      {
        name: "Riser-Based Intervention Vessels",
        description: "Designed to support intervention activities requiring riser systems and specialized subsea access equipment.",
      },
      {
        name: "Coiled Tubing and Pumping Support Vessels",
        description: "Configured to support coiled tubing operations, pumping services, fluid handling, and related offshore well intervention activities.",
      },
    ],
    applications: ["Offshore well servicing", "Subsea maintenance", "Well integrity programs", "Production optimization"],
    drawingNote: "Offshore vessel hull, aft accommodation, intervention tower or intervention equipment, deck piping, crane, and subsea support equipment.",
    image: "/rentals/well-intervention-vessels.webp",
  },
  {
    slug: "jack-up-rigs",
    label: "Jack-Up Rigs and Vessels",
    description:
      "Jack-up units provide stable offshore working platforms for operations requiring a secure working environment in suitable water depths. Using extendable legs lowered to the seabed, these units elevate the main platform above the water surface to support drilling, maintenance, construction, and other offshore activities.",
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
    slug: "dredgers",
    label: "Dredging Equipment",
    description:
      "Dredging equipment supports marine excavation, sediment removal, seabed preparation, and waterway maintenance projects. Equipment selection depends on soil conditions, working depth, material type, access restrictions, and required production capacity.",
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
    slug: "workboats",
    label: "Workboats",
    description:
      "Versatile workboats provide practical marine support for offshore installations, coastal operations, port activities, and marine construction projects. Their adaptable configurations make them suitable for transporting personnel, moving equipment, conducting inspections, and supporting offshore logistics.",
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
    slug: "tugboats",
    label: "Tugboats",
    description:
      "Tugboats provide maneuvering, towing, and vessel-assistance services for ports, terminals, offshore facilities, and marine construction projects. Configurations vary by bollard pull, propulsion arrangement, towing equipment, and operating environment to accommodate different vessel sizes and project requirements. Depending on the unit, tugboats can support ship berthing, unberthing, harbor maneuvering, barge positioning, offshore towing, and selected emergency assistance operations.",
    configurations: [],
    applications: ["Port operations", "Vessel escort", "Barge transportation", "Offshore towing", "Marine construction support"],
    drawingNote: "Compact heavy-duty hull, raised wheelhouse, towing winch, towing hook, bollards, fenders, and exhaust stacks.",
  },
  {
    slug: "barges",
    label: "Barges",
    description:
      "Barges provide flexible deck and cargo capacity for transporting heavy equipment, construction materials, project cargo, and offshore supplies. Available configurations can be matched to project requirements based on deck loading, dimensions, draft, stability, towing arrangements, and operating conditions.",
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
    slug: "pontoons",
    label: "Pontoons",
    description:
      "Work pontoons provide floating platforms for marine construction, maintenance, and operations in locations where stable access from land is limited. Their modular or rectangular configurations can accommodate selected equipment, tools, temporary working areas, and project materials, subject to rated capacity and stability requirements. Depending on the unit, pontoons may feature open working decks, crane mounts, equipment supports, access systems, and mooring arrangements.",
    configurations: [],
    applications: ["Bridge construction", "Quay maintenance", "Piling operations", "Nearshore works", "Dredging support", "Temporary marine work platforms"],
    drawingNote: "Rectangular floating platform, reinforced edges, flat deck, modular sections, access ladders, mooring points, and optional mounted cranes.",
  },
  {
    slug: "tri-toon-vessels",
    label: "Tri-Toon Vessels",
    description:
      "Tri-toon vessels feature three connected hulls designed to provide a broad platform and practical working space for selected marine support operations. Depending on their design and certification, these vessels can accommodate personnel, equipment, inspection systems, and light-duty operational payloads. Their multi-hull configuration can offer useful deck arrangements and operational flexibility for suitable nearshore and inland-water applications.",
    configurations: [],
    applications: ["Marine inspection", "Survey support", "Personnel transportation", "Utility operations", "Selected nearshore projects"],
    drawingNote: "Three distinct parallel hulls connected by a broad deck, compact wheelhouse, railings, deck equipment, and optional utility crane.",
    image: "/rentals/tri-toon-vessels.webp",
  },
  {
    slug: "bunkering-tankers",
    label: "Bunkering Tankers",
    description:
      "Bunkering tankers support the transfer and delivery of marine fuel to vessels, offshore installations, and designated marine facilities. Depending on tank capacity, pumping systems, cargo compatibility, and certification, these vessels can be chartered for planned fuel deliveries and other approved liquid-bulk transfer operations. Typical equipment may include cargo tanks, transfer pumps, manifolds, pipelines, hose-handling arrangements, and associated safety systems.",
    configurations: [],
    applications: ["Ship-to-ship bunkering", "Port fuel supply", "Offshore vessel refueling", "Marine fuel logistics"],
    drawingNote: "Tanker hull, cargo manifold, transfer pipelines, tank access hatches, deck valves, pump equipment, hose-handling arrangements, bridge, and crane where appropriate.",
  },
];

export function rentalBySlug(slug: string): RentalCategory | undefined {
  return RENTAL_CATEGORIES.find((r) => r.slug === slug);
}
