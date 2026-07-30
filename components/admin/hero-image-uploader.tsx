"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrawingReveal } from "@/components/motion/drawing-reveal";
import { createClient } from "@/lib/supabase/client";
import { saveHeroImageAction } from "@/lib/actions/settings";

const BUCKET = "site-images";
const MAX_FILE_SIZE = 10_000_000;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Live replica of the homepage hero (app/(site)/page.tsx) with the upload
 * control layered directly on it, so the background photo admins pick is
 * shown in place rather than as a disconnected thumbnail. Uploads go
 * straight to Supabase Storage (same pattern as components/admin/image-uploader.tsx)
 * then persist the public URL via saveHeroImageAction — see the
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
      {/* Live replica of the public hero section — same classes/structure as
          the "Hero" block in app/(site)/page.tsx, scaled down for the dashboard. */}
      <div className="relative isolate overflow-hidden rounded-sm border border-steel/20 bg-hull text-paper">
        {url && (
          <>
            <Image src={url} alt="" fill unoptimized className="object-cover" aria-hidden />
            <div className="absolute inset-0 bg-hull/80" aria-hidden />
          </>
        )}
        <div
          className="tech-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_35%,black,transparent)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <DrawingReveal className="h-[220px] w-[220px] text-paper/20" />
        </div>

        <div className="relative mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center">
          <span className="label inline-flex items-center gap-2 border border-paper/20 px-3 py-1 text-[10px] text-paper/80">
            <span className="h-1 w-1 shrink-0 rounded-full bg-paper" aria-hidden />
            Marine diesel · engines &amp; parts
          </span>
          <h2 className="mt-4 font-display text-xl font-extrabold tracking-tight sm:text-2xl">
            Trading the fleet — engines, parts and power,{" "}
            <span className="border-b-2 border-paper/25 pb-0.5">across every major brand.</span>
          </h2>
          <p className="mt-3 max-w-[42ch] text-[12px] leading-relaxed text-paper/70">
            Shipcove Trading trades complete marine diesel engines and spare parts — searchable by OEM number, by
            model, and through interactive exploded diagrams.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-sm bg-paper px-4 py-2 text-[12px] font-semibold text-hull">Browse parts</span>
            <span className="rounded-sm border border-paper/25 px-4 py-2 text-[12px] font-semibold text-paper">
              Sell your equipment
            </span>
          </div>
        </div>

        {/* Upload controls, layered directly on the preview */}
        <div className="relative flex flex-wrap items-center justify-between gap-2 border-t border-paper/10 bg-hull/70 px-4 py-3 backdrop-blur-sm">
          <span className="text-[11px] text-paper/60">This is exactly what visitors see on the homepage.</span>
          <div className="flex items-center gap-2">
            {url && (
              <button
                type="button"
                onClick={remove}
                disabled={uploading}
                title="Remove hero image"
                className="grid h-8 w-8 place-items-center rounded-sm border border-paper/25 text-paper transition-colors hover:bg-paper/10 disabled:pointer-events-none disabled:opacity-50"
              >
                <Trash2 size={14} />
              </button>
            )}
            <Button
              type="button"
              variant="inverse"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? "Uploading…" : url ? "Replace image" : "Upload image"}
            </Button>
          </div>
        </div>
      </div>

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
    </div>
  );
}
