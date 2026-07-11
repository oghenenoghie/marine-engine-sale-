import type { Brand, EngineModel, PartCategory } from "@/types";
import { slugify } from "@/lib/utils";

// IDs match the uuids seeded into Supabase by supabase/seed.sql — kept static
// (not fetched) since this reference data is stable and several client
// components (FacetRail, SellForm) import it directly. Stock items, which
// foreign-key against these ids, are the part that's actually admin-edited
// and live-fetched — see lib/data/stock.ts.
export const brands: Brand[] = [
  { id: "11111111-1111-1111-1111-111111111101", slug: "wartsila", name: "Wärtsilä", blurb: "Finnish four-stroke medium-speed diesel and dual-fuel engines." },
  { id: "11111111-1111-1111-1111-111111111102", slug: "man", name: "MAN", blurb: "Two- and four-stroke marine propulsion from MAN Energy Solutions." },
  { id: "11111111-1111-1111-1111-111111111103", slug: "mak", name: "MaK", blurb: "German medium-speed diesel engines, part of the Caterpillar Marine family." },
  { id: "11111111-1111-1111-1111-111111111104", slug: "deutz", name: "Deutz", blurb: "Compact high-speed diesels for auxiliary and propulsion duty." },
  { id: "11111111-1111-1111-1111-111111111105", slug: "caterpillar", name: "Caterpillar", blurb: "Heavy-duty diesel engines and genuine reman parts." },
];

export const engineModels: EngineModel[] = [
  { id: "22222222-2222-2222-2222-222222222201", slug: "vasa-32", brandId: "11111111-1111-1111-1111-111111111101", name: "VASA 32", bore: "320 mm", stroke: "350 mm", config: "In-line 6-9", powerRange: "2280–4830 kW" },
  { id: "22222222-2222-2222-2222-222222222202", slug: "w46", brandId: "11111111-1111-1111-1111-111111111101", name: "W46", bore: "460 mm", stroke: "580 mm", config: "In-line / V", powerRange: "5220–20700 kW" },
  { id: "22222222-2222-2222-2222-222222222203", slug: "l20", brandId: "11111111-1111-1111-1111-111111111101", name: "L20", bore: "200 mm", stroke: "280 mm", config: "In-line 4-9", powerRange: "760–1710 kW" },
  { id: "22222222-2222-2222-2222-222222222204", slug: "l27-38", brandId: "11111111-1111-1111-1111-111111111102", name: "L27/38", bore: "270 mm", stroke: "380 mm", config: "In-line 5-9", powerRange: "1020–2340 kW" },
  { id: "22222222-2222-2222-2222-222222222205", slug: "8m32", brandId: "11111111-1111-1111-1111-111111111103", name: "8M32", bore: "320 mm", stroke: "480 mm", config: "In-line 8", powerRange: "3840 kW" },
  { id: "22222222-2222-2222-2222-222222222206", slug: "bf6m1015", brandId: "11111111-1111-1111-1111-111111111104", name: "BF6M1015", bore: "132 mm", stroke: "145 mm", config: "V8", powerRange: "300–520 kW" },
  { id: "22222222-2222-2222-2222-222222222207", slug: "3516", brandId: "11111111-1111-1111-1111-111111111105", name: "3516", bore: "170 mm", stroke: "215 mm", config: "V16", powerRange: "1865–2525 kW" },
];

export const partCategories: PartCategory[] = [
  { id: "33333333-3333-3333-3333-333333333301", slug: "cylinder-head", name: "Cylinder head", parentId: null },
  { id: "33333333-3333-3333-3333-333333333302", slug: "crankshaft", name: "Crankshaft", parentId: null },
  { id: "33333333-3333-3333-3333-333333333303", slug: "turbocharger", name: "Turbocharger", parentId: null },
  { id: "33333333-3333-3333-3333-333333333304", slug: "cylinder-liner", name: "Cylinder liner", parentId: null },
  { id: "33333333-3333-3333-3333-333333333305", slug: "complete-engine", name: "Complete engine", parentId: null },
  { id: "33333333-3333-3333-3333-333333333306", slug: "fuel-pump", name: "Fuel pump", parentId: null },
  { id: "33333333-3333-3333-3333-333333333307", slug: "piston", name: "Piston", parentId: null },
];

export function brandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug);
}
export function modelBySlug(slug: string) {
  return engineModels.find((m) => m.slug === slug);
}
export function categoryBySlug(slug: string) {
  return partCategories.find((c) => c.slug === slug);
}
export function modelsForBrand(brandId: string) {
  return engineModels.filter((m) => m.brandId === brandId);
}

export function categorySlug(name: string) {
  return slugify(name);
}
