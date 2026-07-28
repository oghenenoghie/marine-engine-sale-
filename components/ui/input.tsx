import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mono?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, mono, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-sm border border-steel/25 bg-white px-3 py-2 text-[13px] text-hull outline-none transition-colors placeholder:text-ash focus:border-hull focus:ring-2 focus:ring-hull",
        mono && "font-mono",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
