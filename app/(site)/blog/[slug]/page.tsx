import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { getBlogPostBySlug } from "@/lib/data/blog";

export const dynamic = "force-dynamic";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-hull underline underline-offset-4">
        <ArrowLeft size={14} /> Back to blog
      </Link>

      <FadeIn>
        <span className="label mt-6 block text-steel">{formatDate(post.publishedAt)}</span>
        <h1 className="mt-2 text-display-lg font-display font-bold tracking-tight text-hull">{post.title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-steel">{post.excerpt}</p>

        {post.coverImage && (
          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-sm">
            <Image src={post.coverImage} alt="" fill unoptimized className="object-cover" />
          </div>
        )}

        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-hull">
          {post.body
            .split(/\n{2,}/)
            .map((s) => s.trim())
            .filter(Boolean)
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>
      </FadeIn>
    </div>
  );
}
