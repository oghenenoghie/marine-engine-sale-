"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, DialogCloseButton } from "@/components/ui/dialog";

export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-sm text-paper transition-colors hover:bg-paper/10 lg:hidden"
        >
          <Menu size={20} />
        </button>
      </SheetTrigger>
      <SheetContent className="max-w-xs bg-hull text-paper">
        <div className="flex items-center justify-between border-b border-paper/10 px-5 py-4">
          <span className="font-display text-base font-extrabold tracking-tight">Menu</span>
          <DialogCloseButton className="border-paper/25 text-paper hover:bg-paper/10" />
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-sm px-3 py-2.5 text-[14px] font-medium text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-paper/10 px-5 py-4">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center border border-paper/25 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-paper transition-colors hover:border-paper hover:bg-paper hover:text-hull"
          >
            Request a quote
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
