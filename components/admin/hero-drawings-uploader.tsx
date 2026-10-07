"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { saveHeroDrawingsAction } from "@/lib/actions/settings";
import type { HeroDrawing } from "@/lib/data/settings";

const BUCKET = "site-images";
const MAX_FILES = 6;
const MAX_FILE_SIZE = 10_000_000;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Admin editor for the homepage hero's technical line drawing(s) + captions
 * (app/(site)/page.tsx, lib/data/settings.ts getHeroDrawings()). Structural
 * changes (add/remove/reorder) are kept in local state alongside caption
 * edits, and committed together via one Save button — unlike
 * HeroImageUploader (which auto-saves per click, since it has no text
 * fields), caption typing makes an auto-save-per-change pattern too chatty.
 */
export function HeroDrawingsUploader({ initial }: { initial: HeroDrawing[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drawings, setDrawings] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="flex items-start gap-2 rounded-sm border border-dashed border-steel/25 px-3 py-3 text-steel">
        <Upload size={16} className="mt-0.5 shrink-0" />
        <span className="text-[12px]">Set NEXT_PUBLIC_SUPABASE_URL to enable image uploads.</span>
      </div>
    );
  }

  const mutate = (next: HeroDrawing[]) => {
    setDrawings(next);
    setDirty(true);
    setSaved(false);
  };

  const onFilesSelected = async (files: FileList | null) => {
    const selected = Array.from(files ?? []).slice(0, MAX_FILES - drawings.length);
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
      const uploaded: HeroDrawing[] = [];
      for (const file of selected) {
        const path = `drydock/hero-drawings/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push({ url: data.publicUrl, caption: "" });
      }
      mutate([...drawings, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — please try again.");
      console.error("[HeroDrawingsUploader] upload error", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (index: number) => mutate(drawings.filter((_, i) => i !== index));

  const setCaption = (index: number, caption: string) =>
    mutate(drawings.map((d, i) => (i === index ? { ...d, caption } : d)));

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= drawings.length) return;
    const next = [...drawings];
    [next[index], next[target]] = [next[target]!, next[index]!];
    mutate(next);
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    const result = await saveHeroDrawingsAction(drawings);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDirty(false);
    setSaved(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[12px] text-steel">
          Shown in the homepage hero — cycles automatically when there&apos;s more than one.
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || drawings.length >= MAX_FILES}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Uploading…" : "Add drawing"}
        </Button>
      </div>

      {drawings.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {drawings.map((drawing, i) => (
            <div key={drawing.url} className="flex gap-3 rounded-sm border border-steel/20 bg-hull p-3">
              <div className={cn("relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-sm bg-hull")}>
                <div className="tech-grid absolute inset-0 opacity-30" aria-hidden />
                <Image src={drawing.url} alt="" fill unoptimized className="relative object-contain p-1" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div>
                  <Label htmlFor={`caption-${i}`} className="text-paper/60">
                    Caption
                  </Label>
                  <Input
                    id={`caption-${i}`}
                    value={drawing.caption}
                    onChange={(e) => setCaption(i, e.target.value)}
                    placeholder="e.g. Light well intervention vessel"
                    className="border-paper/20 bg-hull text-paper placeholder:text-paper/30"
                  />
                </div>
                <div className="mt-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    title="Move earlier"
                    className="grid h-6 w-6 place-items-center rounded-full bg-paper/10 text-paper disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ArrowLeft size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === drawings.length - 1}
                    title="Move later"
                    className="grid h-6 w-6 place-items-center rounded-full bg-paper/10 text-paper disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ArrowRight size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    title="Remove drawing"
                    className="ml-auto grid h-6 w-6 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/20"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
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

      <div className="flex items-center gap-3">
        <Button type="button" size="sm" disabled={saving || !dirty} onClick={onSave}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : "Save hero drawings"}
        </Button>
        {saved && (
          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-hull">
            <Check size={14} /> Saved
          </span>
        )}
      </div>

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
