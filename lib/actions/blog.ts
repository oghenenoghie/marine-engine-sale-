"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin, type ActionResult } from "@/lib/actions/auth";
import type { BlogPost } from "@/types";

export type { ActionResult };

function revalidateBlogPaths() {
  // The Header renders a live blog ticker (components/common/blog-ticker.tsx)
  // on every (site) route via app/(site)/layout.tsx, not just /blog itself —
  // most of those routes aren't force-dynamic, so they're statically cached.
  // Revalidating only "/blog"-ish paths (as before) left the ticker stale
  // everywhere else. Bust the whole tree from the root layout instead, same
  // fix as saveFaviconAction in lib/actions/settings.ts for the same reason.
  revalidatePath("/", "layout");
  revalidatePath("/admin/blog");
}

export async function saveBlogPostAction(post: BlogPost): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("blog_posts").upsert({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      cover_image: post.coverImage || null,
      published: post.published,
      published_at: post.published ? (post.publishedAt ?? new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    });
    if (error) return { ok: false, error: error.message };
    revalidateBlogPaths();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error saving blog post" };
  }
}

export async function deleteBlogPostAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateBlogPaths();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error deleting blog post" };
  }
}
