"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin, type ActionResult } from "@/lib/actions/auth";

export type { ActionResult };

export async function deleteEnquiryAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/enquiries");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error deleting enquiry" };
  }
}
