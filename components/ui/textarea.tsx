import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md border border-steel/25 bg-white px-3 py-2 text-[13px] text-hull outline-none placeholder:text-steel/60 focus:ring-2 focus:ring-blueprint",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
