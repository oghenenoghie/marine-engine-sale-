"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteEnquiryAction } from "@/lib/actions/enquiries";
import type { Enquiry, StockItem } from "@/types";

function formatWhen(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function EnquiriesDashboard({ initialEnquiries, stock }: { initialEnquiries: Enquiry[]; stock: StockItem[] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: string) => {
    setDeleting(true);
    setError(null);
    const result = await deleteEnquiryAction(id);
    if (result.ok) {
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      setDeleteTarget(null);
    } else {
      setError(result.error);
    }
    setDeleting(false);
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-sm border border-hull/30 bg-hull/5 px-4 py-2 text-[12px] font-medium text-hull">{error}</div>
      )}

      <div className="space-y-3">
        {enquiries.length === 0 && <p className="text-[13px] text-steel">No enquiries yet.</p>}
        {enquiries.map((e) => {
          const item = stock.find((s) => s.id === e.stockItemId);
          return (
            <div key={e.id} className="rounded-sm border border-steel/15 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-sm border border-steel/25 px-2 py-0.5 font-mono text-[11px] uppercase text-steel">
                    {e.type === "rfq" ? "Quote request" : "Sell enquiry"}
                  </span>
                  <div className="mt-1.5 text-[14px] font-semibold text-hull">
                    {e.name} {e.company && <span className="font-normal text-steel">· {e.company}</span>}
                  </div>
                  <div className="text-[12px] text-steel">{e.email}</div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-[11px] text-steel">{formatWhen(e.createdAt)}</span>
                  <button
                    onClick={() => setDeleteTarget(e)}
                    title="Delete enquiry"
                    className="grid h-8 w-8 place-items-center rounded-sm border border-steel/25 text-steel transition-colors hover:bg-black/5"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {item && <div className="mt-2 text-[12px] font-medium text-hull">Re: {item.title}</div>}
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

      {deleteTarget && (
        <ConfirmDelete
          label={deleteTarget.name}
          saving={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => remove(deleteTarget.id)}
        />
      )}
    </div>
  );
}

function ConfirmDelete({
  label,
  saving,
  onCancel,
  onConfirm,
}: {
  label: string;
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-hull/50 p-4" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-sm bg-paper p-5 shadow-2xl">
        <div className="mb-1 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-hull/10 text-hull">
            <Trash2 size={16} />
          </div>
          <div className="font-display text-base font-extrabold">Delete enquiry?</div>
        </div>
        <p className="mt-2 text-[13px] text-steel">Enquiry from {label}. This can&apos;t be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-sm border border-steel/25 px-4 py-2 text-[13px] font-medium text-steel transition-colors hover:border-hull hover:text-hull"
          >
            Cancel
          </button>
          <Button variant="primary" onClick={onConfirm} disabled={saving}>
            {saving ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
