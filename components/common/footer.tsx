import Link from "next/link";
import { Anchor } from "lucide-react";

const COLUMNS = [
  {
    heading: "Buy",
    links: [
      { href: "/engines", label: "Engines" },
      { href: "/parts", label: "Parts" },
      { href: "/gensets", label: "Gensets" },
      { href: "/power-plants", label: "Power plants" },
      { href: "/gas-turbines", label: "Gas turbines" },
      { href: "/stock", label: "New & expected stock" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    heading: "Sell",
    links: [{ href: "/sell", label: "Sell your equipment" }],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-hull text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Anchor size={20} className="text-paper" />
            <span className="font-display text-lg font-extrabold tracking-tight">SHIPCOVE TRADING</span>
          </div>
          <p className="mt-3 max-w-[26ch] text-[13px] text-paper/60">
            Marine diesel engines and spare parts, found by drawing, part number and model.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <div className="label text-paper/50">{col.heading}</div>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-paper/75 hover:text-paper">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-paper/10 px-6 py-4">
        <p className="mx-auto max-w-7xl font-mono text-[11px] text-paper/40">
          © {new Date().getFullYear()} Shipcove Trading. Dordrecht.
        </p>
      </div>
    </footer>
  );
}
