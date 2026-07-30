"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { saveHeroImageAction } from "@/lib/actions/settings";

const BUCKET = "site-images";
const MAX_FILE_SIZE = 10_000_000;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Single-image upload widget for the homepage hero background, uploading
 * directly to Supabase Storage (same pattern as components/admin/image-uploader.tsx)
 * then persisting the public URL via saveHeroImageAction — see the
 * "site-images" bucket policies in supabase/migrations/0006_site_settings.sql.
 */
export function HeroImageUploader({ initialUrl }: { initialUrl: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="flex items-start gap-2 rounded-sm border border-dashed border-steel/25 px-3 py-3 text-steel">
        <Upload size={16} className="mt-0.5 shrink-0" />
        <span className="text-[12px]">Set NEXT_PUBLIC_SUPABASE_URL to enable image uploads.</span>
      </div>
    );
  }

  const onFileSelected = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      setError("Image must be JPG, PNG or WEBP and under 10MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const path = `drydock/site/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

      const result = await saveHeroImageAction(data.publicUrl);
      if (!result.ok) throw new Error(result.error);
      setUrl(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — please try again.");
      console.error("[HeroImageUploader] upload error", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async () => {
    setUploading(true);
    setError(null);
    const result = await saveHeroImageAction(null);
    if (result.ok) {
      setUrl(null);
    } else {
      setError(result.error);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      {url && (
        <div className="group relative aspect-[21/9] w-full max-w-xl overflow-hidden rounded-sm border border-steel/20">
          <Image src={url} alt="Homepage hero background" fill unoptimized className="object-cover" />
          <button
            type="button"
            onClick={remove}
            disabled={uploading}
            title="Remove hero image"
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-hull opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-sm border border-hull/30 bg-hull/5 px-3 py-2 text-hull">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span className="text-[12px]">{error}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => onFileSelected(e.target.files)}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="bg-white"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? "Uploading…" : url ? "Replace image" : "Upload image"}
      </Button>
    </div>
  );
}
