"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "brand-logos";
const MAX_FILE_SIZE = 2_000_000;
const ALLOWED_TYPES = ["image/svg+xml", "image/png", "image/webp"];

/**
 * Single-file logo upload for the Brand form — same direct-to-Supabase-Storage
 * pattern as components/admin/image-uploader.tsx, just one file instead of a
 * gallery. See supabase/migrations/0005_brand_logos_bucket.sql for the bucket.
 */
export function LogoUploader({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="flex items-start gap-2 rounded-sm border border-dashed border-steel/25 px-3 py-3 text-steel">
        <Upload size={16} className="mt-0.5 shrink-0" />
        <span className="text-[12px]">Set NEXT_PUBLIC_SUPABASE_URL to enable logo uploads.</span>
      </div>
    );
  }

  const onFileSelected = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      setError("Logo must be SVG, PNG or WEBP and under 2MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="flex items-center gap-3 rounded-sm border border-steel/20 bg-white p-3">
          <div className="relative h-10 w-28 shrink-0">
            <Image src={value} alt="Brand logo preview" fill unoptimized className="object-contain object-left" />
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            title="Remove logo"
            className="ml-auto grid h-7 w-7 place-items-center rounded-full text-steel hover:bg-hull/5 hover:text-hull"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/svg+xml,image/png,image/webp"
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
        {uploading ? "Uploading…" : value ? "Replace logo" : "Upload logo"}
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
