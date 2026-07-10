import { enquiriesSeed } from "@/lib/data/enquiries.seed";
import { stockSeed } from "@/lib/data/stock.seed";

function formatWhen(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function AdminEnquiriesPage() {
  return (
    <div className="p-6">
      <h1 className="font-display text-xl font-extrabold tracking-tight text-hull">Enquiries</h1>
      <p className="text-[12px] text-steel">RFQ and sell-to-us submissions.</p>

      <div className="mt-6 space-y-3">
        {enquiriesSeed.map((e) => {
          const stock = stockSeed.find((s) => s.id === e.stockItemId);
          return (
            <div key={e.id} className="rounded-md border border-steel/15 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded bg-blueprint/10 px-2 py-0.5 font-mono text-[11px] uppercase text-blueprint">
                    {e.type === "rfq" ? "Quote request" : "Sell enquiry"}
                  </span>
                  <div className="mt-1.5 text-[14px] font-semibold text-hull">
                    {e.name} {e.company && <span className="font-normal text-steel">· {e.company}</span>}
                  </div>
                  <div className="text-[12px] text-steel">{e.email}</div>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-steel">{formatWhen(e.createdAt)}</span>
              </div>
              {stock && <div className="mt-2 text-[12px] text-blueprint">Re: {stock.title}</div>}
              <p className="mt-2 whitespace-pre-line text-[13px] text-steel">{e.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
