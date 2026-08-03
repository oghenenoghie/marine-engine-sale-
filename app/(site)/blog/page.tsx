import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { getAllBlogPosts } from "@/lib/data/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "News, guides and buyer advice from Shipcove Trading on marine diesel engines and spare parts.",
};

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <span className="label text-steel">Blog</span>
      <h1 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">News &amp; buyer advice</h1>
      <p className="mt-2 max-w-[60ch] text-[14px] text-steel">
        Guides, market notes and buyer advice on marine diesel engines and spare parts.
      </p>

      {posts.length === 0 && <p className="mt-10 text-[14px] text-steel">No posts yet — check back soon.</p>}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <FadeIn key={post.id} delay={i * 0.04}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-sm border border-steel/15 bg-white transition-colors duration-200 hover:border-hull/40"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-graphite">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 tech-grid opacity-40" aria-hidden />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="label text-steel">{formatDate(post.publishedAt)}</span>
                <h2 className="mt-2 font-display text-lg font-bold tracking-tight text-hull">{post.title}</h2>
                <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed text-steel">{post.excerpt}</p>
                <span className="mt-4 text-[13px] font-semibold text-hull underline underline-offset-4">Read more →</span>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
