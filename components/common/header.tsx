import Link from "next/link";
import { Anchor } from "lucide-react";
import { PartNumberSearch } from "@/components/common/part-number-search";

const NAV = [
  { href: "/engines", label: "Engines" },
  { href: "/parts", label: "Parts" },
  { href: "/brands", label: "Brands" },
  { href: "/stock", label: "Stock" },
  { href: "/sell", label: "Sell to us" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-steel/15 bg-hull text-paper">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <Anchor size={20} className="text-signal" />
          <span className="font-display text-lg font-extrabold tracking-tight">DRYDOCK</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-paper/70 transition-colors hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <PartNumberSearch className="ml-auto w-full max-w-[280px]" />
      </div>
    </header>
  );
}
