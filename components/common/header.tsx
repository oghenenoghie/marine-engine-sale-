import Link from "next/link";
import { Anchor, ArrowUpRight } from "lucide-react";
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
    <header className="sticky top-0 z-30 border-b border-paper/10 bg-hull text-paper">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3.5 sm:gap-6 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Anchor size={20} className="text-paper" />
          <span className="font-display text-lg font-extrabold tracking-tight">SHIPCOVE TRADING</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="group relative py-1 text-[13px] font-medium text-paper/70 transition-colors hover:text-paper">
              {item.label}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-paper transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        <PartNumberSearch className="ml-auto min-w-0 max-w-[160px] flex-1 sm:max-w-[220px]" />

        <Link
          href="/contact"
          className="group hidden shrink-0 items-center gap-1.5 border border-paper/25 px-3.5 py-2 text-[12px] font-semibold uppercase tracking-wider text-paper transition-colors hover:border-paper hover:bg-paper hover:text-hull lg:inline-flex"
        >
          Request a quote
          <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        <MobileNav items={NAV} />
      </div>
    </header>
  );
}
