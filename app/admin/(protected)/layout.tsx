import Link from "next/link";
import { redirect } from "next/navigation";
import { Anchor, ClipboardList, LayoutDashboard, Layers, Package, Ship } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/stock", icon: Package, label: "Stock" },
  { href: "/admin/drawings", icon: Layers, label: "Drawings" },
  { href: "/admin/enquiries", icon: ClipboardList, label: "Enquiries" },
  { href: "/admin/brands", icon: Ship, label: "Brands" },
];

const authConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (authConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.app_metadata?.role !== "admin") redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen w-full bg-paper font-body text-[14px] text-hull">
      <aside className="hidden w-60 shrink-0 flex-col bg-hull md:flex">
        <div className="flex items-center gap-2 px-5 py-5 text-paper">
          <Anchor size={22} className="text-signal" />
          <span className="font-display text-lg font-extrabold tracking-tight">DRYDOCK</span>
        </div>
        <nav className="px-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-[13px] text-paper/60 transition-colors hover:bg-blueprint/15 hover:text-paper"
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>
        {!authConfigured && (
          <div className="mx-3 mt-4 rounded-md border border-signal/30 bg-signal/10 px-3 py-2 text-[11px] leading-relaxed text-signal">
            Auth not configured — admin is open for local development. Set Supabase env vars to enable RLS-gated login.
          </div>
        )}
        <div className="mt-auto px-5 py-4 font-mono text-[11px] text-paper/40">v0.1 · Dordrecht</div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
