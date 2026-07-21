import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { StockImage } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function primaryImage(images: StockImage[]): StockImage | undefined {
  return images.find((img) => img.isPrimary) ?? images[0];
}

export function formatPrice(price: number | null, poa: boolean, currency = "EUR") {
  if (poa || price == null) return "POA";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
