import type { StockStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

const STATUS_STYLE: Record<StockStatus, { label: string; fg: string; bg: string }> = {
  available: { label: "Available", fg: "#6E8B7B", bg: "rgba(110,139,123,0.14)" },
  reserved: { label: "Reserved", fg: "#C6602B", bg: "rgba(198,96,43,0.14)" },
  sold: { label: "Sold", fg: "#3B4A5A", bg: "rgba(59,74,90,0.12)" },
  expected: { label: "Expected", fg: "#2E6E9E", bg: "rgba(46,110,158,0.14)" },
};

export { STATUS_STYLE };

export function StatusBadge({ status }: { status: StockStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <Badge fg={s.fg} bg={s.bg}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.fg }} />
      {s.label}
    </Badge>
  );
}
