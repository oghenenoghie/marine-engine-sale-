"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, ArrowLeft, ArrowRight, Loader2, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DrawingReveal } from "@/components/motion/drawing-reveal";
import { HeroSlider } from "@/components/motion/hero-slider";
import { createClient } from "@/lib/supabase/client";
import { saveHeroImagesAction } from "@/lib/actions/settings";

const BUCKET = "site-images";
const MAX_FILES = 8;
const MAX_FILE_SIZE = 10_000_000;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Live replica of the homepage hero slider (app/(site)/page.tsx +
 * components/motion/hero-slider.tsx) with the upload/reorder controls
 * layered directly on it, so what admins see is exactly what visitors get.
 * Uploads go straight to Supabase Storage (same pattern as
 * components/admin/image-uploader.tsx) then persist the ordered URL list via
 * saveHeroImagesAction — see the "site-images" bucket policies in
 * supabase/migrations/0006_site_settings.sql.
 */
export function HeroImageUploader({ initialUrls }: { initialUrls: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState(initialUrls);
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

  const save = async (next: string[]) => {
    setUrls(next);
    const result = await saveHeroImagesAction(next);
    if (!result.ok) setError(result.error);
  };

  const onFilesSelected = async (files: FileList | null) => {
    const selected = Array.from(files ?? []).slice(0, MAX_FILES - urls.length);
    if (selected.length === 0) return;
    setError(null);

    const invalid = selected.find((f) => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_FILE_SIZE);
    if (invalid) {
      setError("Images must be JPG, PNG or WEBP and under 10MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const uploaded: string[] = [];
      for (const file of selected) {
        const path = `drydock/site/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      await save([...urls, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — please try again.");
      console.error("[HeroImageUploader] upload error", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (url: string) => save(urls.filter((u) => u !== url));

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= urls.length) return;
    const next = [...urls];
    [next[index], next[target]] = [next[target]!, next[index]!];
    save(next);
  };

  return (
    <div className="space-y-3">
      {/* Live replica of the public hero section — same classes/structure as
          the "Hero" block in app/(site)/page.tsx, scaled down for the dashboard. */}
      <div className="relative isolate overflow-hidden rounded-sm border border-steel/20 bg-hull text-paper">
        {urls.length > 0 && (
          <>
            <HeroSlider images={urls} />
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
          <Button
            type="button"
            variant="inverse"
            size="sm"
            disabled={uploading || urls.length >= MAX_FILES}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? "Uploading…" : "Add image"}
          </Button>
        </div>
      </div>

      {urls.length > 0 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {urls.map((url, i) => (
            <div
              key={url}
              className={cn("group relative aspect-video overflow-hidden rounded-sm border border-steel/20")}
            >
              <Image src={url} alt="" fill unoptimized className="object-cover" />
              <span className="absolute left-1 top-1 rounded-sm bg-hull/80 px-1.5 py-0.5 text-[9px] font-semibold text-paper">
                {i + 1}
              </span>
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-hull/0 opacity-0 transition-opacity group-hover:bg-hull/50 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  title="Move earlier"
                  className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-hull disabled:pointer-events-none disabled:opacity-40"
                >
                  <ArrowLeft size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(url)}
                  title="Remove image"
                  className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-hull"
                >
                  <Trash2 size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === urls.length - 1}
                  title="Move later"
                  className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-hull disabled:pointer-events-none disabled:opacity-40"
                >
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
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
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => onFilesSelected(e.target.files)}
      />
    </div>
  );
}
