import { partIcon } from "@/components/common/part-icons";
import type { StockType } from "@/types";

/**
 * Stand-in for a stock item's real photography: a monochrome technical
 * line-drawing icon keyed by part category, on the same dark/tech-grid
 * treatment used for the exploded diagrams and hero drawings elsewhere.
 */
export function TechnicalDrawing({
  categorySlug,
  itemType,
  className,
}: {
  categorySlug: string;
  itemType: StockType;
  className?: string;
}) {
  const Icon = partIcon(itemType === "engine" ? "complete-engine" : categorySlug);

  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-hull ${className ?? ""}`}>
      <div className="tech-grid absolute inset-0 opacity-30" aria-hidden />
      <Icon className="relative h-[52%] w-[52%] text-paper/70" />
    </div>
  );
}
