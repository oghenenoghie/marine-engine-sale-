import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-signal text-white hover:opacity-90",
  dark: "bg-hull text-paper hover:opacity-90",
  outline: "border border-steel/30 text-hull hover:bg-hull/5",
  ghost: "text-steel hover:bg-hull/5",
  link: "text-blueprint underline-offset-4 hover:underline",
} as const;

const sizes = {
  sm: "h-8 px-3 text-[12px]",
  md: "h-10 px-4 text-[13px]",
  lg: "h-12 px-6 text-[15px]",
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-body font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
