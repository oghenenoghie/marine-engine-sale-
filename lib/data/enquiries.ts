import { cache } from "react";
import type { Enquiry } from "@/types";
import { createAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

/**
 * Admin-only data-access for enquiries. RLS restricts reads to the admin
 * JWT role, and the anon key used by createPublicClient has no session
 * here, so this goes through the service-role client — safe because
 * app/admin/(protected)/layout.tsx already gates the route.
 */

type EnquiryRow = Database["public"]["Tables"]["enquiries"]["Row"];

function rowToEnquiry(row: EnquiryRow): Enquiry {
  return {
    id: row.id,
    type: row.type,
    stockItemId: row.stock_item_id,
    name: row.name,
    company: row.company ?? undefined,
    email: row.email,
    phone: row.phone ?? undefined,
    message: row.message,
    attachments: (row.attachments ?? []) as unknown as string[],
    createdAt: row.created_at,
  };
}

export const getAllEnquiries = cache(async (): Promise<Enquiry[]> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(`getAllEnquiries: ${error.message}`);
  return (data ?? []).map(rowToEnquiry);
});
