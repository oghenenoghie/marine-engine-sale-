"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { saveFaviconAction } from "@/lib/actions/settings";

const BUCKET = "site-images";
const MAX_FILE_SIZE = 2_000_000;
const ALLOWED_TYPES = ["image/png", "image/webp", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon"];

/**
 * Single-file site favicon upload — same direct-to-Supabase-Storage pattern
 * as components/admin/logo-uploader.tsx, targeting the "site-images" bucket
 * (supabase/migrations/0006_site_settings.sql) and persisting the URL via
 * saveFaviconAction (lib/data/settings.ts getFaviconUrl, key: favicon_url).
 */
export function FaviconUploader({ initialUrl }: { initialUrl: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="flex items-start gap-2 rounded-sm border border-dashed border-steel/25 px-3 py-3 text-steel">
        <Upload size={16} className="mt-0.5 shrink-0" />
        <span className="text-[12px]">Set NEXT_PUBLIC_SUPABASE_URL to enable favicon uploads.</span>
      </div>
    );
  }

  const onFileSelected = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      setError("Favicon must be PNG, SVG, WEBP or ICO and under 2MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const path = `drydock/site/favicon-${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

      const result = await saveFaviconAction(data.publicUrl);
      if (!result.ok) throw new Error(result.error);
      setUrl(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async () => {
    setUploading(true);
    setError(null);
    const result = await saveFaviconAction(null);
    if (result.ok) {
      setUrl(null);
    } else {
      setError(result.error);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      {url && (
        <div className="flex items-center gap-3 rounded-sm border border-steel/20 bg-white p-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-steel/15">
            <Image src={url} alt="Favicon preview" fill unoptimized className="object-contain" />
          </div>
          <span className="truncate text-[12px] text-steel">This is what shows in the browser tab.</span>
          <button
            type="button"
            onClick={remove}
            disabled={uploading}
            title="Remove favicon"
            className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-full text-steel hover:bg-hull/5 hover:text-hull disabled:pointer-events-none disabled:opacity-50"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/webp,image/svg+xml,image/x-icon,.ico"
        className="hidden"
        onChange={(e) => onFileSelected(e.target.files)}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="w-full bg-white"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? "Uploading…" : url ? "Replace favicon" : "Upload favicon"}
      </Button>
      {error && (
        <div className="flex items-start gap-2 rounded-sm border border-hull/30 bg-hull/5 px-3 py-2 text-hull">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span className="text-[12px]">{error}</span>
        </div>
      )}
    </div>
  );
}
