import type { MetadataRoute } from "next";
import { getAllStock, getAllDrawings } from "@/lib/data/stock";
import { brands, engineModels } from "@/lib/data/taxonomy";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes = ["", "/engines", "/parts", "/stock", "/sell", "/about", "/contact", "/faq"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const brandRoutes = brands.map((b) => ({ url: `${base}/brands/${b.slug}`, lastModified: new Date() }));
  const modelRoutes = engineModels.map((m) => {
    const brand = brands.find((b) => b.id === m.brandId)!;
    return { url: `${base}/brands/${brand.slug}/${m.slug}`, lastModified: new Date() };
  });
  const stockRoutes = getAllStock().map((item) => ({
    url: `${base}/${item.type === "engine" ? "engines" : "parts"}/${item.slug}`,
    lastModified: new Date(item.createdAt),
  }));
  const drawingRoutes = getAllDrawings().map((d) => ({ url: `${base}/drawings/${d.slug}`, lastModified: new Date() }));

  return [...staticRoutes, ...brandRoutes, ...modelRoutes, ...stockRoutes, ...drawingRoutes];
}
