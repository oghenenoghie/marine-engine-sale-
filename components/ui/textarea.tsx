import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-sm border border-steel/25 bg-white px-3 py-2 text-[13px] text-hull outline-none transition-colors placeholder:text-ash focus:border-hull focus:ring-2 focus:ring-hull",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
