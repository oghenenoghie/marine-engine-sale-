import Image from "next/image";
import { getAllEnquiries } from "@/lib/data/enquiries";
import { getAllStock } from "@/lib/data/stock";

export const dynamic = "force-dynamic";

function formatWhen(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default async function AdminEnquiriesPage() {
  const [enquiries, stock] = await Promise.all([getAllEnquiries(), getAllStock()]);

  return (
    <div className="p-6">
      <h1 className="font-display text-xl font-extrabold tracking-tight text-hull">Enquiries</h1>
      <p className="text-[12px] text-steel">RFQ and sell-to-us submissions.</p>

      <div className="mt-6 space-y-3">
        {enquiries.length === 0 && <p className="text-[13px] text-steel">No enquiries yet.</p>}
        {enquiries.map((e) => {
          const item = stock.find((s) => s.id === e.stockItemId);
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
              {item && <div className="mt-2 text-[12px] text-blueprint">Re: {item.title}</div>}
              <p className="mt-2 whitespace-pre-line text-[13px] text-steel">{e.message}</p>
              {e.attachments && e.attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {e.attachments.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="relative block h-16 w-16 overflow-hidden rounded border border-steel/20"
                    >
                      <Image src={url} alt="Attached photo" fill unoptimized className="object-cover" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
