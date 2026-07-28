import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Brand } from "@/types";

/**
 * Renders nothing when a brand has no logo — callers keep their existing
 * text-only treatment as the fallback. Grayscale by default, full color on
 * hover/focus of the nearest `group` ancestor (the brand card/link) — set
 * `muted={false}` for standalone placements (e.g. a brand detail hero) with
 * no hover state to resolve to.
 */
export function BrandLogo({ brand, className, muted = true }: { brand: Brand; className?: string; muted?: boolean }) {
  if (!brand.logo) return null;
  return (
    <div className={cn("relative h-8 w-full", className)}>
      <Image
        src={brand.logo}
        alt={`${brand.name} logo`}
        fill
        unoptimized
        className={cn(
          "object-contain object-left",
          muted && "grayscale transition-all duration-300 group-hover:grayscale-0 group-focus-visible:grayscale-0",
        )}
      />
    </div>
  );
}
