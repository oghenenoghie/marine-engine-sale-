import type { Brand, EngineModel, PartCategory, ProductCategory } from "@/types";
import { BRAND_LOGOS } from "@/lib/data/brand-logos.seed";

// Fixture data pushed into Supabase by scripts/seed.ts and supabase/seed.sql
// — ids match what that seed produces. Also imported directly by
// lib/data/taxonomy.ts as a runtime fallback when Supabase is unreachable
// or unconfigured, and by lib/data/stock.ts/stock.seed.ts/drawings.seed.ts,
// whose fixtures reference these same UUIDs.
export const brandsSeed: Brand[] = [
  { id: "11111111-1111-1111-1111-111111111101", slug: "wartsila", name: "Wärtsilä", blurb: "Finnish four-stroke medium-speed diesel and dual-fuel engines." },
  { id: "11111111-1111-1111-1111-111111111102", slug: "man", name: "MAN", blurb: "Two- and four-stroke marine propulsion from MAN Energy Solutions.", logo: BRAND_LOGOS.man },
  { id: "11111111-1111-1111-1111-111111111103", slug: "mak", name: "MaK", blurb: "German medium-speed diesel engines, part of the Caterpillar Marine family." },
  { id: "11111111-1111-1111-1111-111111111104", slug: "deutz", name: "Deutz", blurb: "Compact high-speed diesels for auxiliary and propulsion duty." },
  { id: "11111111-1111-1111-1111-111111111105", slug: "caterpillar", name: "Caterpillar", blurb: "Heavy-duty diesel engines and genuine reman parts.", logo: BRAND_LOGOS.caterpillar },
  { id: "11111111-1111-1111-1111-111111111106", slug: "abb", name: "ABB", logo: BRAND_LOGOS.abb },
  { id: "11111111-1111-1111-1111-111111111107", slug: "bergen", name: "Bergen" },
  { id: "11111111-1111-1111-1111-111111111108", slug: "man-bw", name: "MAN B&W" },
  { id: "11111111-1111-1111-1111-111111111109", slug: "mtu", name: "MTU" },
  { id: "11111111-1111-1111-1111-111111111110", slug: "mwm", name: "MWM" },
  { id: "11111111-1111-1111-1111-111111111111", slug: "rolls-royce-bergen", name: "Rolls-Royce Bergen" },
  { id: "11111111-1111-1111-1111-111111111112", slug: "sang-yong-man", name: "Sang Yong MAN" },
  { id: "11111111-1111-1111-1111-111111111113", slug: "stork-werkspoor", name: "Stork Werkspoor" },
  { id: "11111111-1111-1111-1111-111111111114", slug: "sulzer", name: "Sulzer" },
  { id: "11111111-1111-1111-1111-111111111115", slug: "wartsila-sulzer", name: "Wartsila Sulzer" },
  { id: "11111111-1111-1111-1111-111111111116", slug: "wichmann", name: "Wichmann" },
];

export const engineModelsSeed: EngineModel[] = [
  { id: "22222222-2222-2222-2222-222222222201", slug: "vasa-32", brandId: "11111111-1111-1111-1111-111111111101", name: "VASA 32", bore: "320 mm", stroke: "350 mm", config: "In-line 6-9", powerRange: "2280–4830 kW" },
  { id: "22222222-2222-2222-2222-222222222202", slug: "w46", brandId: "11111111-1111-1111-1111-111111111101", name: "W46", bore: "460 mm", stroke: "580 mm", config: "In-line / V", powerRange: "5220–20700 kW" },
  { id: "22222222-2222-2222-2222-222222222203", slug: "l20", brandId: "11111111-1111-1111-1111-111111111101", name: "L20", bore: "200 mm", stroke: "280 mm", config: "In-line 4-9", powerRange: "760–1710 kW" },
  { id: "22222222-2222-2222-2222-222222222204", slug: "l27-38", brandId: "11111111-1111-1111-1111-111111111102", name: "L27/38", bore: "270 mm", stroke: "380 mm", config: "In-line 5-9", powerRange: "1020–2340 kW" },
  { id: "22222222-2222-2222-2222-222222222205", slug: "8m32", brandId: "11111111-1111-1111-1111-111111111103", name: "8M32", bore: "320 mm", stroke: "480 mm", config: "In-line 8", powerRange: "3840 kW" },
  { id: "22222222-2222-2222-2222-222222222206", slug: "bf6m1015", brandId: "11111111-1111-1111-1111-111111111104", name: "BF6M1015", bore: "132 mm", stroke: "145 mm", config: "V8", powerRange: "300–520 kW" },
  { id: "22222222-2222-2222-2222-222222222207", slug: "3516", brandId: "11111111-1111-1111-1111-111111111105", name: "3516", bore: "170 mm", stroke: "215 mm", config: "V16", powerRange: "1865–2525 kW" },
];

export const partCategoriesSeed: PartCategory[] = [
  { id: "33333333-3333-3333-3333-333333333301", slug: "cylinder-head", name: "Cylinder head", parentId: null },
  { id: "33333333-3333-3333-3333-333333333302", slug: "crankshaft", name: "Crankshaft", parentId: null },
  { id: "33333333-3333-3333-3333-333333333303", slug: "turbocharger", name: "Turbocharger", parentId: null },
  { id: "33333333-3333-3333-3333-333333333304", slug: "cylinder-liner", name: "Cylinder liner", parentId: null },
  { id: "33333333-3333-3333-3333-333333333305", slug: "complete-engine", name: "Complete engine", parentId: null },
  { id: "33333333-3333-3333-3333-333333333306", slug: "fuel-pump", name: "Fuel pump", parentId: null },
  { id: "33333333-3333-3333-3333-333333333307", slug: "piston", name: "Piston", parentId: null },
  { id: "33333333-3333-3333-3333-333333333308", slug: "alternator", name: "Alternator", parentId: null },
  { id: "33333333-3333-3333-3333-333333333309", slug: "connecting-rod", name: "Connecting rod", parentId: null },
  { id: "33333333-3333-3333-3333-333333333310", slug: "cylinder-block", name: "Cylinder block", parentId: null },
  { id: "33333333-3333-3333-3333-333333333311", slug: "engine-block", name: "Engine block", parentId: null },
  { id: "33333333-3333-3333-3333-333333333312", slug: "liner", name: "Liner", parentId: null },
  { id: "33333333-3333-3333-3333-333333333313", slug: "oil-pump", name: "Oil pump", parentId: null },
  { id: "33333333-3333-3333-3333-333333333314", slug: "water-jacket", name: "Water jacket", parentId: null },
  { id: "33333333-3333-3333-3333-333333333315", slug: "water-pump", name: "Water pump", parentId: null },
];

export const productCategoriesSeed: ProductCategory[] = [
  { id: "55555555-5555-5555-5555-555555555501", slug: "engines", name: "Engines" },
  { id: "55555555-5555-5555-5555-555555555502", slug: "spare-parts", name: "Spare Parts" },
  { id: "55555555-5555-5555-5555-555555555503", slug: "gensets", name: "Gensets" },
  { id: "55555555-5555-5555-5555-555555555504", slug: "power-plants", name: "Power Plants" },
  { id: "55555555-5555-5555-5555-555555555505", slug: "gas-turbines", name: "Gas Turbines" },
];
