/**
 * Hand-authored to match supabase/migrations/0001_init.sql, verified
 * against `supabase gen types` output from the live project (columns,
 * nullability and FKs match exactly; enum-like text columns are narrowed
 * to literal unions here since Postgres CHECK constraints don't surface
 * as TS types in the generator's output). Regenerate with:
 *   supabase gen types typescript --project-id <id> > types/supabase.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: { id: string; slug: string; name: string; logo: string | null; blurb: string | null };
        Insert: { id?: string; slug: string; name: string; logo?: string | null; blurb?: string | null };
        Update: Partial<Database["public"]["Tables"]["brands"]["Insert"]>;
        Relationships: [];
      };
      engine_models: {
        Row: {
          id: string;
          slug: string;
          brand_id: string;
          name: string;
          bore: string | null;
          stroke: string | null;
          config: string | null;
          power_range: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          brand_id: string;
          name: string;
          bore?: string | null;
          stroke?: string | null;
          config?: string | null;
          power_range?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["engine_models"]["Insert"]>;
        Relationships: [];
      };
      part_categories: {
        Row: { id: string; slug: string; name: string; parent_id: string | null };
        Insert: { id?: string; slug: string; name: string; parent_id?: string | null };
        Update: Partial<Database["public"]["Tables"]["part_categories"]["Insert"]>;
        Relationships: [];
      };
      stock_items: {
        Row: {
          id: string;
          sku: string;
          slug: string;
          title: string;
          type: "engine" | "part";
          brand_id: string;
          model_id: string | null;
          category_id: string;
          condition: "New" | "Used" | "Reconditioned";
          poa: boolean;
          price: number | null;
          qty: number;
          status: "available" | "reserved" | "sold" | "expected";
          oem_numbers: string[];
          specs: Json;
          images: Json;
          drawing_id: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["stock_items"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["stock_items"]["Insert"]>;
        Relationships: [];
      };
      drawings: {
        Row: { id: string; slug: string; title: string; model_id: string; asset_key: string; hotspots: Json };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          model_id: string;
          asset_key: string;
          hotspots?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["drawings"]["Insert"]>;
        Relationships: [];
      };
      enquiries: {
        Row: {
          id: string;
          type: "rfq" | "sell";
          stock_item_id: string | null;
          name: string;
          company: string | null;
          email: string;
          phone: string | null;
          message: string;
          attachments: Json;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["enquiries"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["enquiries"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
