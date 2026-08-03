export type StockType = "engine" | "part";
export type StockStatus = "available" | "reserved" | "sold" | "expected";
export type Condition = "New" | "Used" | "Reconditioned";
export type ImageType = "photo" | "drawing";
export type Currency = "EUR" | "USD" | "GBP" | "NOK" | "SEK" | "DKK" | "JPY" | "SGD" | "CNY";

export const CURRENCIES: Currency[] = ["EUR", "USD", "GBP", "NOK", "SEK", "DKK", "JPY", "SGD", "CNY"];

export interface StockImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
  type: ImageType;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  blurb?: string;
}

export interface EngineModel {
  id: string;
  slug: string;
  brandId: string;
  name: string;
  bore?: string;
  stroke?: string;
  config?: string;
  powerRange?: string;
}

export interface PartCategory {
  id: string;
  slug: string;
  name: string;
  parentId?: string | null;
}

// Top-level catalog section (Engines, Spare Parts, Gensets, Power Plants,
// Gas Turbines) — broader than PartCategory, which is the fine-grained
// per-part taxonomy (cylinder head, turbocharger, …).
export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
}

export interface StockItem {
  id: string;
  sku: string;
  title: string;
  slug: string;
  type: StockType;
  brandId: string;
  modelId?: string | null;
  categoryId: string;
  productCategoryId?: string | null;
  condition: Condition;
  poa: boolean;
  price: number | null;
  currency: Currency;
  qty: number;
  status: StockStatus;
  oemNumbers: string[];
  specs: Record<string, string>;
  images: StockImage[];
  drawingId?: string | null;
  description?: string;
  createdAt: string;
}

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  stockItemId?: string | null;
  inStock: boolean;
}

export interface Drawing {
  id: string;
  slug: string;
  title: string;
  modelId: string;
  assetKey: string;
  hotspots: Hotspot[];
}

export type EnquiryType = "rfq" | "sell";

export interface Enquiry {
  id: string;
  type: EnquiryType;
  stockItemId?: string | null;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Denormalized view used across the UI (StockItem + resolved Brand/Model/Category)
export interface StockItemView extends StockItem {
  brand: Brand;
  model?: EngineModel;
  category: PartCategory;
  productCategory?: ProductCategory;
}
