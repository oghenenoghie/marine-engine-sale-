"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { AlertTriangle, ArrowDown, ArrowUp, Check, ChevronDown, Loader2, Plus, RotateCcw, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { resetHeroSliderAction, saveHeroSliderAction, type ActionResult } from "@/lib/actions/settings";
import {
  BUILT_IN_SLIDE_DRAWINGS,
  DEFAULT_HERO_SLIDER,
  MAX_HERO_SLIDES,
  SLIDE_INTERVAL_MAX,
  SLIDE_INTERVAL_MIN,
  type HeroSlide,
  type HeroSliderSettings,
} from "@/lib/data/hero-slides";
import { cn } from "@/lib/utils";

const BUCKET = "site-images";
const MAX_FILE_SIZE = 10_000_000;
const ALLOWED_TYPES = ["image/png", "image/webp", "image/jpeg"];
const SELECT_CLASS =
  "w-full rounded-sm border border-steel/25 bg-white px-3 py-2 text-[13px] text-hull outline-none transition-colors focus:border-hull focus:ring-2 focus:ring-hull";

const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `slide-${Date.now()}`);

const blankSlide = (): HeroSlide => ({
  id: newId(),
  label: "",
  eyebrow: "",
  headline: "",
  body: "",
  primary: { label: "Browse rental fleet", href: "/rentals#fleet" },
  secondary: { label: "", href: "" },
});

/**
 * Admin editor for the homepage hero carousel (components/common/fleet-hero-slider.tsx):
 * per-slide copy, buttons and drawing, slide order, and seconds per slide.
 * Edits stay local until "Save slider" (same pattern as HeroDrawingsUploader);
 * "Restore defaults" deletes the saved row so the homepage goes back to the
 * slides derived from lib/data/rentals.ts.
 */
export function HeroSliderEditor({ initial }: { initial: HeroSliderSettings }) {
  const uploadInput = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<string | null>(null);
  const [slides, setSlides] = useState(initial.slides);
  const [interval, setIntervalValue] = useState(String(initial.intervalSeconds));
  const [openId, setOpenId] = useState<string | null>(initial.slides[0]?.id ?? null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [busy, setBusy] = useState<"save" | "reset" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const canUpload = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  const touch = () => {
    setDirty(true);
    setStatus(null);
  };

  const mutate = (next: HeroSlide[]) => {
    setSlides(next);
    touch();
  };

  const update = (id: string, patch: Partial<HeroSlide>) => mutate(slides.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[index], next[target]] = [next[target]!, next[index]!];
    mutate(next);
  };

  const remove = (id: string) => mutate(slides.filter((s) => s.id !== id));

  const add = () => {
    const slide = blankSlide();
    mutate([...slides, slide]);
    setOpenId(slide.id);
  };

  const startUpload = (id: string) => {
    uploadTarget.current = id;
    uploadInput.current?.click();
  };

  const onFileSelected = async (file: File | undefined) => {
    const id = uploadTarget.current;
    if (!file || !id) return;
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      setError("Drawings must be PNG, WEBP or JPG and under 10MB.");
      return;
    }
    setUploadingId(id);
    try {
      const supabase = createClient();
      const path = `drydock/hero-slides/${newId()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      update(id, { image: data.publicUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — please try again.");
      console.error("[HeroSliderEditor] upload error", err);
    } finally {
      setUploadingId(null);
      if (uploadInput.current) uploadInput.current.value = "";
    }
  };

  // Server actions can also reject (network drop, server error) — surface that instead of spinning forever.
  const run = async (kind: "save" | "reset", action: () => Promise<ActionResult>, onOk: () => void) => {
    setBusy(kind);
    setError(null);
    try {
      const result = await action();
      if (result.ok) onOk();
      else setError(result.error);
    } catch (err) {
      console.error(`[HeroSliderEditor] ${kind} failed`, err);
      setError(`Couldn't ${kind === "save" ? "save" : "restore"} — check your connection and try again.`);
    } finally {
      setBusy(null);
    }
  };

  const onSave = () =>
    run(
      "save",
      () => saveHeroSliderAction({ intervalSeconds: Number(interval), slides }),
      () => {
        setDirty(false);
        setStatus("Saved");
      },
    );

  const onReset = () => {
    if (!window.confirm("Replace every slide and the speed with the defaults? Your saved slides will be removed.")) return;
    return run("reset", resetHeroSliderAction, () => {
      setSlides(DEFAULT_HERO_SLIDER.slides);
      setIntervalValue(String(DEFAULT_HERO_SLIDER.intervalSeconds));
      setOpenId(DEFAULT_HERO_SLIDER.slides[0]?.id ?? null);
      setDirty(false);
      setStatus("Defaults restored");
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="w-40">
          <Label htmlFor="hero-slide-interval">Seconds per slide</Label>
          <Input
            id="hero-slide-interval"
            type="number"
            inputMode="decimal"
            min={SLIDE_INTERVAL_MIN}
            max={SLIDE_INTERVAL_MAX}
            step={0.5}
            value={interval}
            onChange={(e) => {
              setIntervalValue(e.target.value);
              touch();
            }}
          />
        </div>
        <p className="max-w-[46ch] flex-1 text-[12px] text-steel">
          Lower is faster ({SLIDE_INTERVAL_MIN}–{SLIDE_INTERVAL_MAX}s). Rotation pauses while a visitor hovers the hero.
        </p>
        <Button type="button" variant="outline" size="sm" disabled={slides.length >= MAX_HERO_SLIDES} onClick={add}>
          <Plus size={14} /> Add slide
        </Button>
      </div>

      <ol className="space-y-2">
        {slides.map((slide, i) => {
          const open = openId === slide.id;
          const field = (name: string) => `${slide.id}-${name}`;
          const isBuiltIn = !slide.image || BUILT_IN_SLIDE_DRAWINGS.some((d) => d.src === slide.image);
          return (
            <li key={slide.id} className="rounded-sm border border-steel/20 bg-white">
              <div className="flex items-center gap-3 p-2.5">
                <div className="relative aspect-[3/2] w-20 shrink-0 overflow-hidden rounded-sm bg-hull">
                  <div className="tech-grid absolute inset-0 opacity-40" aria-hidden />
                  {slide.image ? (
                    <Image src={slide.image} alt="" fill unoptimized className="relative object-contain p-1" />
                  ) : (
                    <span className="relative grid h-full place-items-center font-mono text-[9px] uppercase text-paper/50">
                      Line art
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : slide.id)}
                  aria-expanded={open}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-hull">
                      {i + 1}. {slide.label || slide.headline || "Untitled slide"}
                    </div>
                    <div className="truncate text-[12px] text-steel">{slide.headline || "No headline yet"}</div>
                  </div>
                  <ChevronDown size={16} className={cn("shrink-0 text-steel transition-transform", open && "rotate-180")} />
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <IconButton label={`Move slide ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                    <ArrowUp size={13} />
                  </IconButton>
                  <IconButton label={`Move slide ${i + 1} down`} disabled={i === slides.length - 1} onClick={() => move(i, 1)}>
                    <ArrowDown size={13} />
                  </IconButton>
                  <IconButton label={`Remove slide ${i + 1}`} disabled={slides.length === 1} onClick={() => remove(slide.id)}>
                    <Trash2 size={13} />
                  </IconButton>
                </div>
              </div>

              {open && (
                <div className="grid gap-3 border-t border-steel/10 p-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor={field("headline")}>Headline</Label>
                    <Input
                      id={field("headline")}
                      value={slide.headline}
                      onChange={(e) => update(slide.id, { headline: e.target.value })}
                      placeholder="e.g. Charter without limits."
                    />
                  </div>
                  <div>
                    <Label htmlFor={field("eyebrow")}>Badge above headline (optional)</Label>
                    <Input id={field("eyebrow")} value={slide.eyebrow} onChange={(e) => update(slide.id, { eyebrow: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor={field("label")}>Slide name (shown by the arrows)</Label>
                    <Input
                      id={field("label")}
                      value={slide.label}
                      onChange={(e) => update(slide.id, { label: e.target.value })}
                      placeholder="Defaults to the headline"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor={field("body")}>Paragraph (optional)</Label>
                    <Textarea id={field("body")} rows={3} value={slide.body} onChange={(e) => update(slide.id, { body: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor={field("primary-label")}>Main button text</Label>
                    <Input
                      id={field("primary-label")}
                      value={slide.primary.label}
                      onChange={(e) => update(slide.id, { primary: { ...slide.primary, label: e.target.value } })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={field("primary-href")}>Main button link</Label>
                    <Input
                      id={field("primary-href")}
                      mono
                      value={slide.primary.href}
                      onChange={(e) => update(slide.id, { primary: { ...slide.primary, href: e.target.value } })}
                      placeholder="/rentals/barges"
                    />
                  </div>
                  <div>
                    <Label htmlFor={field("secondary-label")}>Second button text (optional)</Label>
                    <Input
                      id={field("secondary-label")}
                      value={slide.secondary.label}
                      onChange={(e) => update(slide.id, { secondary: { ...slide.secondary, label: e.target.value } })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={field("secondary-href")}>Second button link</Label>
                    <Input
                      id={field("secondary-href")}
                      mono
                      value={slide.secondary.href}
                      onChange={(e) => update(slide.id, { secondary: { ...slide.secondary, href: e.target.value } })}
                      placeholder="/contact"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor={field("image")}>Drawing</Label>
                    <div className="flex flex-wrap gap-2">
                      <select
                        id={field("image")}
                        className={cn(SELECT_CLASS, "min-w-0 flex-1")}
                        value={slide.image ?? ""}
                        onChange={(e) => update(slide.id, { image: e.target.value || undefined })}
                      >
                        <option value="">Animated line drawing</option>
                        {BUILT_IN_SLIDE_DRAWINGS.map((d) => (
                          <option key={d.src} value={d.src}>
                            {d.label}
                          </option>
                        ))}
                        {!isBuiltIn && <option value={slide.image}>Uploaded drawing</option>}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        disabled={!canUpload || uploadingId !== null}
                        onClick={() => startUpload(slide.id)}
                      >
                        {uploadingId === slide.id ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        Upload
                      </Button>
                    </div>
                    <p className="mt-1 text-[11px] text-steel">
                      {canUpload
                        ? "Uploads look best as light linework on a transparent PNG/WEBP — the hero background is near-black."
                        : "Set NEXT_PUBLIC_SUPABASE_URL to enable uploads."}
                    </p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-sm border border-hull/30 bg-hull/5 px-3 py-2 text-hull">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span className="text-[12px]">{error}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" size="sm" disabled={busy !== null || !dirty} onClick={onSave}>
          {busy === "save" ? <Loader2 size={14} className="animate-spin" /> : "Save slider"}
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled={busy !== null} onClick={onReset}>
          {busy === "reset" ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
          Restore defaults
        </Button>
        {status && (
          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-hull">
            <Check size={14} /> {status}
          </span>
        )}
        {dirty && <span className="text-[12px] text-steel">Unsaved changes</span>}
      </div>

      <input
        ref={uploadInput}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => onFileSelected(e.target.files?.[0])}
      />
    </div>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-7 w-7 place-items-center rounded-sm border border-steel/20 text-steel transition-colors hover:border-hull/40 hover:text-hull disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
