import { cache } from "react";
import type { Brand, EngineModel, PartCategory } from "@/types";
import { createPublicClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

/**
 * Supabase-backed taxonomy (brands, engine models, part categories).
 * RLS: public read, admin write via lib/actions/taxonomy.ts.
 */

type BrandRow = Database["public"]["Tables"]["brands"]["Row"];
type ModelRow = Database["public"]["Tables"]["engine_models"]["Row"];
type CategoryRow = Database["public"]["Tables"]["part_categories"]["Row"];

function rowToBrand(row: BrandRow): Brand {
  return { id: row.id, slug: row.slug, name: row.name, logo: row.logo ?? undefined, blurb: row.blurb ?? undefined };
}

function rowToModel(row: ModelRow): EngineModel {
  return {
    id: row.id,
    slug: row.slug,
    brandId: row.brand_id,
    name: row.name,
    bore: row.bore ?? undefined,
    stroke: row.stroke ?? undefined,
    config: row.config ?? undefined,
    powerRange: row.power_range ?? undefined,
  };
}

function rowToCategory(row: CategoryRow): PartCategory {
  return { id: row.id, slug: row.slug, name: row.name, parentId: row.parent_id };
}

export const getAllBrands = cache(async (): Promise<Brand[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("brands").select("*").order("name");
  if (error) throw new Error(`getAllBrands: ${error.message}`);
  return (data ?? []).map(rowToBrand);
});

export const getAllModels = cache(async (): Promise<EngineModel[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("engine_models").select("*").order("name");
  if (error) throw new Error(`getAllModels: ${error.message}`);
  return (data ?? []).map(rowToModel);
});

export const getAllCategories = cache(async (): Promise<PartCategory[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("part_categories").select("*").order("name");
  if (error) throw new Error(`getAllCategories: ${error.message}`);
  return (data ?? []).map(rowToCategory);
});

export function brandBySlug(brands: Brand[], slug: string) {
  return brands.find((b) => b.slug === slug);
}
export function modelBySlug(models: EngineModel[], slug: string) {
  return models.find((m) => m.slug === slug);
}
export function categoryBySlug(categories: PartCategory[], slug: string) {
  return categories.find((c) => c.slug === slug);
}
export function modelsForBrand(models: EngineModel[], brandId: string) {
  return models.filter((m) => m.brandId === brandId);
}
