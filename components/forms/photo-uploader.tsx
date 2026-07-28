"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "sell-photos";
const MAX_FILES = 12;
const MAX_FILE_SIZE = 10_000_000;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

/** Lets a seller attach photos of their equipment before submitting the sell enquiry. */
export function PhotoUploader({ photoUrls, onChange }: { photoUrls: string[]; onChange: (urls: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="flex items-start gap-2 rounded-sm border border-dashed border-steel/25 px-3 py-3 text-steel">
        <Upload size={16} className="mt-0.5 shrink-0" />
        <span className="text-[12px]">Photo upload is not configured yet — reply-all any photos to the confirmation email.</span>
      </div>
    );
  }

  const onFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const selected = Array.from(files).slice(0, MAX_FILES - photoUrls.length);
    const invalid = selected.find((f) => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_FILE_SIZE);
    if (invalid) {
      setError("Photos must be JPG, PNG, WEBP or HEIC and under 10MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const uploaded: string[] = [];
      for (const file of selected) {
        const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      onChange([...photoUrls, ...uploaded]);
    } catch {
      setError("Upload failed — please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {photoUrls.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {photoUrls.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-sm border border-steel/20">
              <Image src={url} alt="Uploaded equipment photo" fill unoptimized className="object-cover" />
              <button
                type="button"
                onClick={() => onChange(photoUrls.filter((u) => u !== url))}
                className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-hull/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={11} />
              </button>
            </div>
          ))}
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
        disabled={uploading || photoUrls.length >= MAX_FILES}
        onClick={() => inputRef.current?.click()}
        className="w-full bg-white"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? "Uploading…" : "Add photos"}
      </Button>
      {error && <p className="text-[12px] font-medium text-hull">{error}</p>}
    </div>
  );
}
