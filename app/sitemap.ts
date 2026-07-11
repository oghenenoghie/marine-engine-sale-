import type { MetadataRoute } from "next";
import { getAllStock, getAllDrawings } from "@/lib/data/stock";
import { getAllBrands, getAllModels } from "@/lib/data/taxonomy";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes = ["", "/engines", "/parts", "/stock", "/sell", "/about", "/contact", "/faq"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const [allStock, allDrawings, brands, engineModels] = await Promise.all([
    getAllStock(),
    getAllDrawings(),
    getAllBrands(),
    getAllModels(),
  ]);
  const brandRoutes = brands.map((b) => ({ url: `${base}/brands/${b.slug}`, lastModified: new Date() }));
  const modelRoutes = engineModels.map((m) => {
    const brand = brands.find((b) => b.id === m.brandId)!;
    return { url: `${base}/brands/${brand.slug}/${m.slug}`, lastModified: new Date() };
  });
  const stockRoutes = allStock.map((item) => ({
    url: `${base}/${item.type === "engine" ? "engines" : "parts"}/${item.slug}`,
    lastModified: new Date(item.createdAt),
  }));
  const drawingRoutes = allDrawings.map((d) => ({ url: `${base}/drawings/${d.slug}`, lastModified: new Date() }));

  return [...staticRoutes, ...brandRoutes, ...modelRoutes, ...stockRoutes, ...drawingRoutes];
}
