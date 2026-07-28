import { cn } from "@/lib/utils";
import type { StockStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

/**
 * Availability is a technical fact, not a brand accent — communicated by
 * dot fill/outline and label weight (solid = live, hollow = not yet/not
 * currently transactable), never by hue.
 */
const STATUS_STYLE: Record<StockStatus, { label: string; outline: boolean; dot: string; strike?: boolean }> = {
  available: { label: "Available", outline: false, dot: "bg-paper" },
  reserved: { label: "Reserved", outline: true, dot: "border border-steel bg-transparent" },
  expected: { label: "Expected", outline: true, dot: "border border-dashed border-steel bg-transparent" },
  sold: { label: "Sold", outline: true, dot: "bg-steel/50", strike: true },
};

export { STATUS_STYLE };

export function StatusBadge({ status }: { status: StockStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <Badge outline={s.outline}>
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", s.dot)} />
      <span className={s.strike ? "line-through" : undefined}>{s.label}</span>
    </Badge>
  );
}
