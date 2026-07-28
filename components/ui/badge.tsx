import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  outline,
  children,
}: {
  className?: string;
  /** Hollow/outline treatment instead of the solid-fill default. */
  outline?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide",
        outline ? "border-steel/40 bg-transparent text-steel" : "border-hull bg-hull text-paper",
        className,
      )}
    >
      {children}
    </span>
  );
}
