/**
 * Pushes the taxonomy + stock fixtures from lib/data/*.seed.ts into a live
 * Supabase project. Requires SUPABASE_SERVICE_ROLE_KEY. For local dev,
 * `supabase db push` + supabase/seed.sql is usually simpler; this script is
 * for pushing the same fixtures into a hosted preview/staging project.
 */
import { createClient } from "@supabase/supabase-js";
import {
  brandsSeed as brands,
  engineModelsSeed as engineModels,
  partCategoriesSeed as partCategories,
  productCategoriesSeed as productCategories,
} from "../lib/data/taxonomy.seed";
import { stockSeed } from "../lib/data/stock.seed";
import { drawingsSeed } from "../lib/data/drawings.seed";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.");
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  console.log("Seeding brands…");
  await supabase.from("brands").upsert(
    brands.map((b) => ({ id: b.id, slug: b.slug, name: b.name, logo: b.logo ?? null, blurb: b.blurb ?? null })),
  );

  console.log("Seeding engine models…");
  await supabase.from("engine_models").upsert(
    engineModels.map((m) => ({
      id: m.id,
      slug: m.slug,
      brand_id: m.brandId,
      name: m.name,
      bore: m.bore ?? null,
      stroke: m.stroke ?? null,
      config: m.config ?? null,
      power_range: m.powerRange ?? null,
    })),
  );

  console.log("Seeding part categories…");
  await supabase.from("part_categories").upsert(
    partCategories.map((c) => ({ id: c.id, slug: c.slug, name: c.name, parent_id: c.parentId ?? null })),
  );

  console.log("Seeding product categories…");
  await supabase.from("categories").upsert(
    productCategories.map((c) => ({ id: c.id, slug: c.slug, name: c.name })),
  );

  console.log("Seeding drawings…");
  await supabase.from("drawings").upsert(
    drawingsSeed.map((d) => ({
      id: d.id,
      slug: d.slug,
      title: d.title,
      model_id: d.modelId,
      asset_key: d.assetKey,
      hotspots: d.hotspots,
    })),
  );

  console.log("Seeding stock items…");
  await supabase.from("stock_items").upsert(
    stockSeed.map((s) => ({
      sku: s.sku,
      slug: s.slug,
      title: s.title,
      type: s.type,
      brand_id: s.brandId,
      model_id: s.modelId ?? null,
      category_id: s.categoryId,
      product_category_id: s.productCategoryId ?? null,
      condition: s.condition,
      poa: s.poa,
      price: s.price,
      currency: s.currency,
      qty: s.qty,
      status: s.status,
      oem_numbers: s.oemNumbers,
      specs: s.specs,
      images: s.images,
      drawing_id: s.drawingId ?? null,
      description: s.description ?? null,
    })),
    { onConflict: "sku" },
  );

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
