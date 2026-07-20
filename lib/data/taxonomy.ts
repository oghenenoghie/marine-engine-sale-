import { cache } from "react";
import type { Brand, EngineModel, PartCategory } from "@/types";
import { createPublicClient } from "@/lib/supabase/server";
import { brandsSeed, engineModelsSeed, partCategoriesSeed } from "@/lib/data/taxonomy.seed";
import type { Database } from "@/types/supabase";

/**
 * Supabase-backed taxonomy (brands, engine models, part categories).
 * RLS: public read, admin write via lib/actions/taxonomy.ts. Falls back to
 * lib/data/taxonomy.seed.ts when Supabase is unreachable or unconfigured,
 * so pages don't 500 in local/demo environments without a live project.
 */

function warnFallback(name: string, err: unknown) {
  console.warn(`[lib/data/taxonomy] ${name} falling back to seed fixtures:`, err);
}

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
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("brands").select("*").order("name");
    if (error) throw new Error(`getAllBrands: ${error.message}`);
    return (data ?? []).map(rowToBrand);
  } catch (err) {
    warnFallback("getAllBrands", err);
    return brandsSeed;
  }
});

export const getAllModels = cache(async (): Promise<EngineModel[]> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("engine_models").select("*").order("name");
    if (error) throw new Error(`getAllModels: ${error.message}`);
    return (data ?? []).map(rowToModel);
  } catch (err) {
    warnFallback("getAllModels", err);
    return engineModelsSeed;
  }
});

export const getAllCategories = cache(async (): Promise<PartCategory[]> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("part_categories").select("*").order("name");
    if (error) throw new Error(`getAllCategories: ${error.message}`);
    return (data ?? []).map(rowToCategory);
  } catch (err) {
    warnFallback("getAllCategories", err);
    return partCategoriesSeed;
  }
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
