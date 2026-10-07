import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { IconComponent } from "@/components/common/rental-icons";

/**
 * Category card pattern: large icon, title, a plain stacked list of what's
 * included, and a footer row (item count + "Browse" CTA). Adapted from a
 * reference marine-services card layout to Drydock's own tokens — sharp
 * `rounded-sm` corners and a monochrome hull/steel palette instead of the
 * reference's rounded corners and blue accent.
 */
export function CategoryCard({
  href,
  icon: Icon,
  label,
  highlights,
}: {
  href: string;
  icon: IconComponent;
  label: string;
  highlights: string[];
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-sm border border-steel/15 bg-white p-7 transition-colors duration-200 hover:border-hull/40"
    >
      <Icon className="h-16 w-16 shrink-0 text-hull" />
      <div className="mt-4 font-display text-xl font-bold tracking-tight text-hull">{label}</div>
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
    </Link>
  );
}
