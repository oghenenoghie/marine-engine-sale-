"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

const ROTATE_MS = 4500;

/**
 * Compact header badge that cycles through the latest published blog posts,
 * linking to whichever one is currently shown — "swapping button" for the
 * latest blog update. Posts come from the server (Header fetches via
 * lib/data/blog.ts); this component only owns the rotation.
 */
export function BlogTicker({ posts }: { posts: { slug: string; title: string }[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || posts.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % posts.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduceMotion, posts.length]);

  if (posts.length === 0) return null;
  const post = posts[index % posts.length]!;

  return (
    <Link
      href={`/blog/${post.slug}`}
      title={post.title}
      className="group flex min-w-0 items-center gap-2 text-[12px] font-medium text-paper/75 transition-colors hover:text-paper"
    >
      <Newspaper size={12} className="shrink-0" />
      <span className="label shrink-0 text-paper/50">Latest</span>
      <span key={post.slug} className={cn("min-w-0 truncate", !reduceMotion && "animate-in fade-in duration-300")}>
        {post.title}
      </span>
    </Link>
  );
}
