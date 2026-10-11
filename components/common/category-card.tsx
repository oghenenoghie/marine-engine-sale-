import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { IconComponent } from "@/components/common/rental-icons";

/**
 * Category card pattern: a drawing panel (the category's technical drawing on
 * a hull/tech-grid backdrop, or its line icon when no drawing has been
 * supplied yet), title, a plain stacked list of what's included, and a footer
 * row (item count + "Browse" CTA). Adapted from a reference marine-services
 * card layout to Drydock's own tokens — sharp `rounded-sm` corners and a
 * monochrome hull/steel palette instead of the reference's rounded corners
 * and blue accent.
 */
export function CategoryCard({
  href,
  icon: Icon,
  image,
  label,
  highlights,
}: {
  href: string;
  icon: IconComponent;
  /** Paper-on-transparent drawing under /public (see lib/data/rentals.ts); falls back to `icon`. */
  image?: string;
  label: string;
  highlights: string[];
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-sm border border-steel/15 bg-white transition-colors duration-200 hover:border-hull/40"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-hull">
        <div className="tech-grid absolute inset-0 opacity-50" aria-hidden />
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            unoptimized
            className="object-contain p-4 opacity-90 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="relative grid h-full w-full place-items-center">
            <Icon className="h-20 w-20 text-paper/70" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-7">
        <div className="font-display text-xl font-bold tracking-tight text-hull">{label}</div>
        <ul className="mt-3 flex flex-1 flex-col gap-2">
          {highlights.map((h) => (
            <li key={h} className="text-[13px] leading-relaxed text-steel">
              {h}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between border-t border-steel/10 pt-4">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-steel">
            {highlights.length} {highlights.length === 1 ? "option" : "options"}
          </span>
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-hull underline underline-offset-4">
            Browse
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
