import Link from "next/link";
import { Newspaper } from "lucide-react";
import { InfiniteScroll } from "@/components/motion/infinite-scroll";

/**
 * Scrolling header strip of the latest published blog posts — "news flash"
 * ticker. Reuses the same marquee mechanism as the homepage brand row
 * (components/motion/infinite-scroll.tsx): continuous horizontal scroll,
 * falling back to a plain scrollable row under prefers-reduced-motion.
 */
export function BlogTicker({ posts }: { posts: { slug: string; title: string }[] }) {
  if (posts.length === 0) return null;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex shrink-0 items-center gap-1.5">
        <Newspaper size={12} className="shrink-0 text-paper" />
        <span className="label text-red-500">Latest</span>
      </span>
      <InfiniteScroll speed="slow" className="min-w-0 flex-1">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="whitespace-nowrap text-[12px] font-bold text-paper transition-colors hover:text-paper/80"
          >
            {post.title}
          </Link>
        ))}
      </InfiniteScroll>
    </div>
  );
}
