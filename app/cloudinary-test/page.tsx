"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

function EnvRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-steel/10 py-2 text-[13px]">
      <span className="font-mono text-steel">{label}</span>
      {value ? (
        <span className="truncate font-mono text-emerald-600">{value}</span>
      ) : (
        <span className="font-mono font-semibold text-signal">MISSING</span>
      )}
    </div>
  );
}

/**
 * Temporary diagnostic page for the Cloudinary upload widget — bypasses the
 * app's ImageUploader/PhotoUploader to isolate whether failures come from
 * env var config (shown above) or the Cloudinary account/preset itself
 * (shown in the event log below, straight from the widget's onError).
 * Safe to delete once uploads work end to end.
 */
export default function CloudinaryTestPage() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog((l) => [`${new Date().toLocaleTimeString()} — ${msg}`, ...l]);

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="font-display text-xl font-bold">Cloudinary diagnostic</h1>
      <p className="mt-1 text-[13px] text-steel">
        Shows exactly what&apos;s baked into this deployment&apos;s client bundle, and the raw error from Cloudinary&apos;s
        widget if the upload fails.
      </p>

      <div className="mt-6 rounded-md border border-steel/15 bg-white p-4">
        <EnvRow label="NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME" value={CLOUD_NAME} />
        <EnvRow label="NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET" value={UPLOAD_PRESET} />
        <EnvRow label="NEXT_PUBLIC_CLOUDINARY_API_KEY" value={API_KEY} />
      </div>

      {CLOUD_NAME && UPLOAD_PRESET ? (
        <CldUploadWidget
          uploadPreset={UPLOAD_PRESET}
          options={{ sources: ["local"] }}
          onOpen={() => addLog("Widget opened")}
          onSuccess={(result) => addLog(`SUCCESS: ${JSON.stringify(result.info)}`)}
          onError={(error) => addLog(`ERROR: ${JSON.stringify(error)}`)}
        >
          {({ open }) => (
            <Button type="button" onClick={() => open()} className="mt-6">
              Run test upload
            </Button>
          )}
        </CldUploadWidget>
      ) : (
        <p className="mt-6 text-[13px] text-signal">
          Set the missing env var(s) above in Vercel and redeploy before testing — the widget can&apos;t initialize
          without them.
        </p>
      )}

      <div className="mt-6 space-y-1">
        <h2 className="text-[12px] font-semibold uppercase text-steel">Event log</h2>
        {log.length === 0 && <p className="text-[12px] text-steel/60">No events yet.</p>}
        {log.map((entry, i) => (
          <pre key={i} className="whitespace-pre-wrap rounded bg-hull/5 px-2 py-1 font-mono text-[11px] text-hull">
            {entry}
          </pre>
        ))}
      </div>
    </div>
  );
}
