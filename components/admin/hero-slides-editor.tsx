"use client";

import { useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { saveHeroSlidesAction } from "@/lib/actions/settings";
import { RENTAL_CATEGORIES } from "@/lib/data/rentals";
import type { HeroSlide } from "@/lib/data/settings";

const BUCKET = "site-images";
const MAX_FILE_SIZE = 10_000_000;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SLIDES = 8;

/**
 * Slide drawings come from the rental category drawings (lib/data/rentals.ts),
 * so every hero slide shares the same paper-on-transparent linework. One
 * option per distinct file — categories that share a drawing share an option.
 */
const CATEGORY_DRAWINGS: { url: string; label: string }[] = Object.entries(
  RENTAL_CATEGORIES.reduce<Record<string, string[]>>((acc, category) => {
    if (category.image) (acc[category.image] ??= []).push(category.label);
    return acc;
  }, {}),
).map(([url, labels]) => ({ url, label: labels.join(" / ") }));

const blankSlide = (): HeroSlide => ({
  id: crypto.randomUUID(),
  eyebrow: "",
  headline: "",
  body: "",
  primaryHref: "",
  primaryLabel: "",
  secondaryHref: "",
  secondaryLabel: "",
  backgroundImage: "",
  drawingUrl: "",
  drawingCaption: "",
});

/**
 * Admin editor for the homepage hero — one ordered list of fully
 * self-contained slides (app/(site)/page.tsx, lib/data/settings.ts
 * getHeroSlides()). Each slide owns its own copy, both CTAs, an optional
 * background photo, and an optional technical drawing (picked from the rental
 * category drawings) + caption — this is
 * the single source of slide content the public <FleetHeroSlider/> renders
 * (rental-category slides are appended after these at render time, derived
 * from lib/data/rentals.ts rather than admin input). Structural edits
 * (add/remove/reorder/upload) and text edits are both kept in local state and
 * committed together via one Save button, same pattern as the old
 * HeroDrawingsUploader this replaces.
 */
export function HeroSlidesEditor({ initial }: { initial: HeroSlide[] }) {
  const [slides, setSlides] = useState(initial);
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

  const mutate = (next: HeroSlide[]) => {
    setSlides(next);
    setDirty(true);
    setSaved(false);
  };

  const update = (index: number, patch: Partial<HeroSlide>) =>
    mutate(slides.map((s, i) => (i === index ? { ...s, ...patch } : s)));

  const addSlide = () => mutate([...slides, blankSlide()]);
  const removeSlide = (index: number) => mutate(slides.filter((_, i) => i !== index));

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[index], next[target]] = [next[target]!, next[index]!];
    mutate(next);
  };

  const uploadBackground = async (index: number, file: File) => {
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      setError("Images must be JPG, PNG or WEBP and under 10MB.");
      return;
    }
    setError(null);
    try {
      const supabase = createClient();
      const path = `drydock/hero-slides/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      update(index, { backgroundImage: data.publicUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — please try again.");
      console.error("[HeroSlidesEditor] upload error", err);
    }
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    const result = await saveHeroSlidesAction(slides);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDirty(false);
    setSaved(true);
  };

  return (
    <div className="space-y-4">
      {slides.map((slide, i) => (
        <SlideCard
          key={slide.id}
          slide={slide}
          index={i}
          count={slides.length}
          onChange={(patch) => update(i, patch)}
          onUpload={(file) => uploadBackground(i, file)}
          onMove={(dir) => move(i, dir)}
          onRemove={() => removeSlide(i)}
        />
      ))}

      <Button type="button" variant="outline" size="sm" disabled={slides.length >= MAX_SLIDES} onClick={addSlide}>
        <Plus size={14} /> Add slide
      </Button>

      {error && (
        <div className="flex items-start gap-2 rounded-sm border border-hull/30 bg-hull/5 px-3 py-2 text-hull">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span className="text-[12px]">{error}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="button" size="sm" disabled={saving || !dirty} onClick={onSave}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : "Save hero slides"}
        </Button>
        {saved && (
          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-hull">
            <Check size={14} /> Saved
          </span>
        )}
      </div>
    </div>
  );
}

function SlideCard({
  slide,
  index,
  count,
  onChange,
  onUpload,
  onMove,
  onRemove,
}: {
  slide: HeroSlide;
  index: number;
  count: number;
  onChange: (patch: Partial<HeroSlide>) => void;
  onUpload: (file: File) => Promise<void>;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const bgInputRef = useRef<HTMLInputElement>(null);
  const [uploadingBg, setUploadingBg] = useState(false);

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploadingBg(true);
    await onUpload(file);
    setUploadingBg(false);
  };

  return (
    <div className="rounded-sm border border-steel/20 bg-hull p-4 text-paper">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-paper/50">
          Slide {index + 1} of {count}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            title="Move earlier"
            className="grid h-6 w-6 place-items-center rounded-full bg-paper/10 text-paper disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft size={12} />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === count - 1}
            title="Move later"
            className="grid h-6 w-6 place-items-center rounded-full bg-paper/10 text-paper disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowRight size={12} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={count <= 1}
            title="Remove slide"
            className="grid h-6 w-6 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/20 disabled:pointer-events-none disabled:opacity-30"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`eyebrow-${slide.id}`} className="text-paper/60">
            Eyebrow badge
          </Label>
          <Input
            id={`eyebrow-${slide.id}`}
            value={slide.eyebrow}
            onChange={(e) => onChange({ eyebrow: e.target.value })}
            className="border-paper/20 bg-hull text-paper placeholder:text-paper/30"
          />
        </div>
        <div>
          <Label htmlFor={`headline-${slide.id}`} className="text-paper/60">
            Headline
          </Label>
          <Input
            id={`headline-${slide.id}`}
            value={slide.headline}
            onChange={(e) => onChange({ headline: e.target.value })}
            className="border-paper/20 bg-hull text-paper placeholder:text-paper/30"
          />
        </div>
      </div>

      <div className="mt-3">
        <Label htmlFor={`body-${slide.id}`} className="text-paper/60">
          Body
        </Label>
        <Textarea
          id={`body-${slide.id}`}
          rows={2}
          value={slide.body}
          onChange={(e) => onChange({ body: e.target.value })}
          className="border-paper/20 bg-hull text-paper placeholder:text-paper/30"
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`primary-label-${slide.id}`} className="text-paper/60">
              Primary CTA label
            </Label>
            <Input
              id={`primary-label-${slide.id}`}
              value={slide.primaryLabel}
              onChange={(e) => onChange({ primaryLabel: e.target.value })}
              className="border-paper/20 bg-hull text-paper placeholder:text-paper/30"
            />
          </div>
          <div>
            <Label htmlFor={`primary-href-${slide.id}`} className="text-paper/60">
              Primary CTA link
            </Label>
            <Input
              id={`primary-href-${slide.id}`}
              value={slide.primaryHref}
              onChange={(e) => onChange({ primaryHref: e.target.value })}
              className="border-paper/20 bg-hull text-paper placeholder:text-paper/30"
              mono
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`secondary-label-${slide.id}`} className="text-paper/60">
              Secondary CTA label
            </Label>
            <Input
              id={`secondary-label-${slide.id}`}
              value={slide.secondaryLabel}
              onChange={(e) => onChange({ secondaryLabel: e.target.value })}
              className="border-paper/20 bg-hull text-paper placeholder:text-paper/30"
            />
          </div>
          <div>
            <Label htmlFor={`secondary-href-${slide.id}`} className="text-paper/60">
              Secondary CTA link
            </Label>
            <Input
              id={`secondary-href-${slide.id}`}
              value={slide.secondaryHref}
              onChange={(e) => onChange({ secondaryHref: e.target.value })}
              className="border-paper/20 bg-hull text-paper placeholder:text-paper/30"
              mono
            />
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <ImageField
          label="Background photo"
          hint="Optional — dimmed full-bleed backdrop behind this slide."
          url={slide.backgroundImage}
          uploading={uploadingBg}
          inputRef={bgInputRef}
          onPick={() => bgInputRef.current?.click()}
          onFiles={handleFile}
          onRemove={() => onChange({ backgroundImage: "" })}
        />
        <div>
          <DrawingField
            id={`drawing-${slide.id}`}
            url={slide.drawingUrl}
            // A caption described the previous drawing, so start the new one without.
            onChange={(url) => onChange({ drawingUrl: url, drawingCaption: "" })}
          />
          {slide.drawingUrl && (
            <div className="mt-2">
              <Label htmlFor={`drawing-caption-${slide.id}`} className="text-paper/60">
                Drawing caption
              </Label>
              <Input
                id={`drawing-caption-${slide.id}`}
                value={slide.drawingCaption}
                onChange={(e) => onChange({ drawingCaption: e.target.value })}
                className="border-paper/20 bg-hull text-paper placeholder:text-paper/30"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DrawingField({ id, url, onChange }: { id: string; url: string; onChange: (url: string) => void }) {
  const isCategoryDrawing = CATEGORY_DRAWINGS.some((d) => d.url === url);
  return (
    <div>
      <Label htmlFor={id} className="text-paper/60">
        Technical drawing
      </Label>
      <p className="text-[11px] text-paper/40">From the rental categories — or none for the animated placeholder.</p>
      <div className="mt-1 flex items-center gap-2">
        {url && (
          <div className="tech-grid relative h-12 w-20 shrink-0 overflow-hidden rounded-sm border border-paper/20 bg-hull">
            <Image src={url} alt="" fill unoptimized className="object-contain p-1" />
          </div>
        )}
        <select
          id={id}
          value={url}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 min-w-0 flex-1 rounded-sm border border-paper/20 bg-hull px-2 text-[12px] text-paper outline-none focus:border-paper/50"
        >
          <option value="">None — animated placeholder</option>
          {CATEGORY_DRAWINGS.map((d) => (
            <option key={d.url} value={d.url}>
              {d.label}
            </option>
          ))}
          {url && !isCategoryDrawing && <option value={url}>Custom image (uploaded earlier)</option>}
        </select>
      </div>
    </div>
  );
}

function ImageField({
  label,
  hint,
  url,
  uploading,
  inputRef,
  onPick,
  onFiles,
  onRemove,
}: {
  label: string;
  hint: string;
  url: string;
  uploading: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onPick: () => void;
  onFiles: (files: FileList | null) => void;
  onRemove: () => void;
}) {
  return (
    <div>
      <Label className="text-paper/60">{label}</Label>
      <p className="text-[11px] text-paper/40">{hint}</p>
      <div className="mt-1 flex items-center gap-2">
        {url && (
          <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-sm border border-paper/20 bg-hull">
            <Image src={url} alt="" fill unoptimized className="object-cover" />
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={onPick}
          className="border-paper/20 bg-hull text-paper hover:bg-paper/10"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Uploading…" : url ? "Replace" : "Upload"}
        </Button>
        {url && (
          <button
            type="button"
            onClick={onRemove}
            title="Remove image"
            className="grid h-7 w-7 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/20"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
    </div>
  );
}
