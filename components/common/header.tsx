import Link from "next/link";
import { Anchor } from "lucide-react";
import { PartNumberSearch } from "@/components/common/part-number-search";
import { MobileNav } from "@/components/common/mobile-nav";

const NAV = [
  { href: "/engines", label: "Engines" },
  { href: "/parts", label: "Parts" },
  { href: "/gensets", label: "Gensets" },
  { href: "/power-plants", label: "Power plants" },
  { href: "/gas-turbines", label: "Gas turbines" },
  { href: "/brands", label: "Brands" },
  { href: "/stock", label: "Stock" },
  { href: "/sell", label: "Sell to us" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-steel/15 bg-hull text-paper">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3.5 sm:gap-6 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Anchor size={20} className="text-signal" />
          <span className="font-display text-lg font-extrabold tracking-tight">SHIPCOVE TRADING</span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex">
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

        <PartNumberSearch className="ml-auto min-w-0 max-w-[160px] flex-1 sm:max-w-[280px]" />

        <MobileNav items={NAV} />
      </div>
    </header>
  );
}
