import type { BlogPost } from "@/types";

// Fixture data for local/demo use when Supabase is unreachable or
// unconfigured — see the runtime-fallback note in lib/data/blog.ts.
export const blogPostsSeed: BlogPost[] = [
  {
    id: "66666666-6666-6666-6666-666666666601",
    slug: "sourcing-genuine-marine-diesel-parts",
    title: "Sourcing genuine marine diesel parts: what buyers should check first",
    excerpt: "OEM numbers, condition photos and provenance — the three things to verify before you commit to a part.",
    body: "When you're sourcing a replacement cylinder head or turbocharger for a marine diesel engine, the OEM part number is your single most reliable anchor — cross-reference it against the engine's parts catalogue before anything else. Condition photography matters just as much: multi-angle shots with honest wear notes tell you more than a spec sheet ever will. Finally, ask for provenance — where the part came from, and whether it was reconditioned or new-surplus.",
    published: true,
    publishedAt: "2026-06-02T09:00:00.000Z",
    createdAt: "2026-06-01T14:00:00.000Z",
    updatedAt: "2026-06-02T09:00:00.000Z",
  },
  {
    id: "66666666-6666-6666-6666-666666666602",
    slug: "wartsila-vs-man-medium-speed-engines",
    title: "Wärtsilä vs. MAN: comparing medium-speed engine platforms",
    excerpt: "A practical look at bore, stroke and power-range differences across the two most common medium-speed platforms in the secondary market.",
    body: "Wärtsilä's VASA and W-series engines and MAN's medium-speed platforms both dominate the secondary market for auxiliary and propulsion power. Bore and stroke dimensions drive spare-part compatibility more than brand alone — two engines from different manufacturers can share more in common than two generations from the same manufacturer. When evaluating a used engine or its spares, always confirm bore/stroke/configuration against the model plate rather than assuming from the model name.",
    published: true,
    publishedAt: "2026-06-10T09:00:00.000Z",
    createdAt: "2026-06-09T11:30:00.000Z",
    updatedAt: "2026-06-10T09:00:00.000Z",
  },
  {
    id: "66666666-6666-6666-6666-666666666603",
    slug: "decommissioning-a-vessel-what-buyers-look-for",
    title: "Decommissioning a vessel? Here's what buyers actually look for",
    excerpt: "A practical checklist for sellers ahead of a decommissioning sale — from running hours to spare-parts inventory.",
    body: "Sellers preparing for a decommissioning sale often underestimate how much documentation buyers expect: running hours since last overhaul, maintenance logs, and a full spare-parts inventory all materially affect price. Photograph everything before disassembly — buyers pay a premium for engines and parts they can visually verify. If you're unsure what's sellable, submit a sell enquiry with photos and let a buyer's team assess it.",
    published: true,
    publishedAt: "2026-06-18T09:00:00.000Z",
    createdAt: "2026-06-17T08:15:00.000Z",
    updatedAt: "2026-06-18T09:00:00.000Z",
  },
];
