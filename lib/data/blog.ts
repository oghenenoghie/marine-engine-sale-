import { cache } from "react";
import type { BlogPost } from "@/types";
import { createPublicClient, createAdminClient } from "@/lib/supabase/server";
import { blogPostsSeed } from "@/lib/data/blog.seed";
import type { Database } from "@/types/supabase";

/**
 * Blog posts — public pages read only published rows via the public client
 * (RLS-enforced) and fall back to lib/data/blog.seed.ts fixtures when
 * Supabase is unreachable/unconfigured, matching lib/data/stock.ts and
 * lib/data/taxonomy.ts. The admin dashboard needs drafts too, so
 * getAllBlogPostsAdmin() goes through the service-role client instead (no
 * seed fallback — same reasoning as lib/data/enquiries.ts: there's nothing
 * meaningful to fall back to for admin-only data). Writes go through
 * lib/actions/blog.ts.
 */

type BlogPostRow = Database["public"]["Tables"]["blog_posts"]["Row"];

function rowToBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    coverImage: row.cover_image ?? undefined,
    published: row.published,
    publishedAt: row.published_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const getAllBlogPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error) throw new Error(`getAllBlogPosts: ${error.message}`);
    return (data ?? []).map(rowToBlogPost);
  } catch (err) {
    console.warn("[lib/data/blog] getAllBlogPosts falling back to seed fixtures:", err);
    return blogPostsSeed
      .filter((p) => p.published)
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  }
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(`getBlogPostBySlug: ${error.message}`);
    return data ? rowToBlogPost(data) : null;
  } catch (err) {
    console.warn("[lib/data/blog] getBlogPostBySlug falling back to seed fixtures:", err);
    return blogPostsSeed.find((p) => p.slug === slug && p.published) ?? null;
  }
});

export const getAllBlogPostsAdmin = cache(async (): Promise<BlogPost[]> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(`getAllBlogPostsAdmin: ${error.message}`);
  return (data ?? []).map(rowToBlogPost);
});

export function latestBlogPosts(posts: BlogPost[], limit: number): BlogPost[] {
  return posts.slice(0, limit);
}
