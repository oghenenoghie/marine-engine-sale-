import type { Drawing } from "@/types";

// modelId reuses the VASA 32 UUID from taxonomy.seed.ts so this fixture
// resolves correctly when lib/data/stock.ts falls back to it.
export const drawingsSeed: Drawing[] = [
  {
    id: "d-vasa32-exploded",
    slug: "wartsila-vasa-32-exploded",
    title: "Wärtsilä VASA 32 — cylinder unit exploded view",
    modelId: "22222222-2222-2222-2222-222222222201",
    assetKey: "drydock/drawings/vasa32-exploded",
    hotspots: [
      { id: "01", x: 0.5, y: 0.16, label: "Cylinder head", stockItemId: "1", inStock: true },
      { id: "02", x: 0.72, y: 0.28, label: "Turbocharger", stockItemId: "8", inStock: true },
      { id: "03", x: 0.5, y: 0.55, label: "Cylinder liner", stockItemId: "9", inStock: true },
      { id: "04", x: 0.3, y: 0.42, label: "Fuel injection pump", stockItemId: null, inStock: false },
      { id: "05", x: 0.5, y: 0.86, label: "Crankshaft", stockItemId: null, inStock: false },
    ],
  },
];
