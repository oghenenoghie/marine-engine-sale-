import type { Brand, EngineModel, PartCategory } from "@/types";
import { slugify } from "@/lib/utils";

export const brands: Brand[] = [
  { id: "b-wartsila", slug: "wartsila", name: "Wärtsilä", blurb: "Finnish four-stroke medium-speed diesel and dual-fuel engines." },
  { id: "b-man", slug: "man", name: "MAN", blurb: "Two- and four-stroke marine propulsion from MAN Energy Solutions." },
  { id: "b-mak", slug: "mak", name: "MaK", blurb: "German medium-speed diesel engines, part of the Caterpillar Marine family." },
  { id: "b-deutz", slug: "deutz", name: "Deutz", blurb: "Compact high-speed diesels for auxiliary and propulsion duty." },
  { id: "b-caterpillar", slug: "caterpillar", name: "Caterpillar", blurb: "Heavy-duty diesel engines and genuine reman parts." },
];

export const engineModels: EngineModel[] = [
  { id: "m-vasa32", slug: "vasa-32", brandId: "b-wartsila", name: "VASA 32", bore: "320 mm", stroke: "350 mm", config: "In-line 6-9", powerRange: "2280–4830 kW" },
  { id: "m-w46", slug: "w46", brandId: "b-wartsila", name: "W46", bore: "460 mm", stroke: "580 mm", config: "In-line / V", powerRange: "5220–20700 kW" },
  { id: "m-l20", slug: "l20", brandId: "b-wartsila", name: "L20", bore: "200 mm", stroke: "280 mm", config: "In-line 4-9", powerRange: "760–1710 kW" },
  { id: "m-l2732", slug: "l27-38", brandId: "b-man", name: "L27/38", bore: "270 mm", stroke: "380 mm", config: "In-line 5-9", powerRange: "1020–2340 kW" },
  { id: "m-8m32", slug: "8m32", brandId: "b-mak", name: "8M32", bore: "320 mm", stroke: "480 mm", config: "In-line 8", powerRange: "3840 kW" },
  { id: "m-bf6m1015", slug: "bf6m1015", brandId: "b-deutz", name: "BF6M1015", bore: "132 mm", stroke: "145 mm", config: "V8", powerRange: "300–520 kW" },
  { id: "m-3516", slug: "3516", brandId: "b-caterpillar", name: "3516", bore: "170 mm", stroke: "215 mm", config: "V16", powerRange: "1865–2525 kW" },
];

export const partCategories: PartCategory[] = [
  { id: "c-cylinder-head", slug: "cylinder-head", name: "Cylinder head", parentId: null },
  { id: "c-crankshaft", slug: "crankshaft", name: "Crankshaft", parentId: null },
  { id: "c-turbocharger", slug: "turbocharger", name: "Turbocharger", parentId: null },
  { id: "c-cylinder-liner", slug: "cylinder-liner", name: "Cylinder liner", parentId: null },
  { id: "c-complete-engine", slug: "complete-engine", name: "Complete engine", parentId: null },
  { id: "c-fuel-pump", slug: "fuel-pump", name: "Fuel pump", parentId: null },
  { id: "c-piston", slug: "piston", name: "Piston", parentId: null },
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
