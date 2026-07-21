"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Loader2, Star, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { StockImage } from "@/types";

const BUCKET = "stock-photos";
const MAX_FILES = 12;
const MAX_FILE_SIZE = 10_000_000;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

/**
 * Drag-drop / click-to-upload widget for stock photography, uploading
 * directly to Supabase Storage (same pattern as components/forms/photo-uploader.tsx)
 * via the browser's admin-authenticated session — see the "stock-photos"
 * bucket policies in supabase/migrations/0004_stock_photos_bucket.sql.
 */
export function ImageUploader({
  images,
  onChange,
  folder = "drydock/stock",
}: {
  images: StockImage[];
  onChange: (images: StockImage[]) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeImage = (url: string) => {
    const filtered = images.filter((img) => img.url !== url);
    if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
      filtered[0]!.isPrimary = true;
    }
    onChange(filtered);
  };

  const makePrimary = (url: string) => {
    onChange(images.map((img) => ({ ...img, isPrimary: img.url === url })));
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-dashed border-steel/25 px-3 py-3 text-steel">
        <Upload size={16} className="mt-0.5 shrink-0" />
        <span className="text-[12px]">Set NEXT_PUBLIC_SUPABASE_URL to enable image uploads.</span>
      </div>
    );
  }

  const onFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const selected = Array.from(files).slice(0, MAX_FILES - images.length);
    const invalid = selected.find((f) => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_FILE_SIZE);
    if (invalid) {
      setError("Photos must be JPG, PNG, WEBP or HEIC and under 10MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const uploaded: StockImage[] = [];
      for (const file of selected) {
        const path = `${folder}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push({
          url: data.publicUrl,
          alt: file.name,
          isPrimary: images.length === 0 && uploaded.length === 0,
          type: "photo",
        });
      }
      onChange([...images, ...uploaded]);
    } catch {
      setError("Upload failed — please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img) => (
            <div
              key={img.url}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-md border",
                img.isPrimary ? "border-signal" : "border-steel/20",
              )}
            >
              <Image src={img.url} alt={img.alt} fill unoptimized className="object-cover" />
              <div className="absolute inset-0 flex items-start justify-between bg-hull/0 p-1 opacity-0 transition-opacity group-hover:bg-hull/40 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => makePrimary(img.url)}
                  title="Set as primary photo"
                  className={cn(
                    "grid h-6 w-6 place-items-center rounded-full bg-white/90",
                    img.isPrimary ? "text-signal" : "text-steel",
                  )}
                >
                  <Star size={12} fill={img.isPrimary ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(img.url)}
                  title="Remove photo"
                  className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-signal"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              {img.isPrimary && (
                <span className="absolute bottom-1 left-1 rounded bg-signal px-1.5 py-0.5 text-[9px] font-semibold uppercase text-white">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-signal/30 bg-signal/10 px-3 py-2 text-signal">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span className="text-[12px]">{error}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="hidden"
        onChange={(e) => onFilesSelected(e.target.files)}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading || images.length >= MAX_FILES}
        onClick={() => inputRef.current?.click()}
        className="w-full bg-white"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? "Uploading…" : "Upload photos"}
      </Button>
    </div>
  );
}
