import Link from "next/link";
import { getAllStock } from "@/lib/data/stock";
import { enquiriesSeed } from "@/lib/data/enquiries.seed";

function Stat({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <div className="rounded-md border border-steel/15 bg-white px-4 py-3">
      <div className="label text-steel">{label}</div>
      <div className="mt-1 font-display text-2xl font-extrabold" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const stock = getAllStock();
  const stats = {
    total: stock.length,
    available: stock.filter((i) => i.status === "available").length,
    reserved: stock.filter((i) => i.status === "reserved").length,
    expected: stock.filter((i) => i.status === "expected").length,
  };

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="font-display text-xl font-extrabold tracking-tight text-hull">Dashboard</h1>
        <p className="text-[12px] text-steel">Overview of stock and enquiries</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total items" value={stats.total} />
        <Stat label="Available" value={stats.available} accent="#6E8B7B" />
        <Stat label="Reserved" value={stats.reserved} accent="#C6602B" />
        <Stat label="Expected" value={stats.expected} accent="#2E6E9E" />
      </div>

      <div className="mt-8 rounded-md border border-steel/15 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-hull">Recent enquiries</h2>
          <Link href="/admin/enquiries" className="text-[12px] font-semibold text-blueprint">
            View all →
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-steel/10">
          {enquiriesSeed.slice(0, 3).map((e) => (
            <li key={e.id} className="py-2.5 text-[13px]">
              <span className="font-medium text-hull">{e.name}</span>{" "}
              <span className="text-steel">— {e.type === "rfq" ? "quote request" : "sell enquiry"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
