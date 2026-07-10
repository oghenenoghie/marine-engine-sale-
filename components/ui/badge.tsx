import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  fg,
  bg,
  children,
}: {
  className?: string;
  fg?: string;
  bg?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{ color: fg, background: bg }}
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide",
        !fg && !bg && "bg-steel/10 text-steel",
        className,
      )}
    >
      {children}
    </span>
  );
}
