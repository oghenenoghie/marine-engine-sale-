"use client";

import { useState } from "react";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveHeroSlideIntervalAction } from "@/lib/actions/settings";
import { SLIDE_INTERVAL_MAX, SLIDE_INTERVAL_MIN } from "@/lib/data/hero-speed";

/**
 * Admin control for how long each homepage hero slide stays up
 * (components/common/fleet-hero-slider.tsx autoplay). Saved separately from
 * the slide content in HeroSlidesEditor, so a speed tweak never needs every
 * slide's fields to validate.
 */
export function HeroSlideSpeed({ initialSeconds }: { initialSeconds: number }) {
  const [value, setValue] = useState(String(initialSeconds));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const result = await saveHeroSlideIntervalAction(Number(value));
      if (result.ok) setSaved(true);
      else setError(result.error);
    } catch (err) {
      // The action itself can reject (network drop, server error) — don't leave the button spinning.
      console.error("[HeroSlideSpeed] save failed", err);
      setError("Couldn't save — check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-36">
          <Label htmlFor="hero-slide-seconds">Seconds per slide</Label>
          <Input
            id="hero-slide-seconds"
            type="number"
            inputMode="decimal"
            min={SLIDE_INTERVAL_MIN}
            max={SLIDE_INTERVAL_MAX}
            step={0.5}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setSaved(false);
            }}
          />
        </div>
        <Button type="button" size="sm" disabled={saving} onClick={onSave}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : "Save speed"}
        </Button>
        {saved && (
          <span className="inline-flex items-center gap-1 pb-2 text-[12px] font-medium text-hull">
            <Check size={14} /> Saved
          </span>
        )}
      </div>
      <p className="text-[12px] text-steel">
        Lower is faster ({SLIDE_INTERVAL_MIN}–{SLIDE_INTERVAL_MAX}s). Rotation pauses while a visitor hovers the hero.
      </p>
      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-sm border border-hull/30 bg-hull/5 px-3 py-2 text-hull">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span className="text-[12px]">{error}</span>
        </div>
      )}
    </div>
  );
}
