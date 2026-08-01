"use client";

import { useState } from "react";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveHeroCopyAction } from "@/lib/actions/settings";
import type { HeroCopy } from "@/lib/data/settings";

/**
 * Admin form for the homepage hero's text content (eyebrow badge, headline,
 * paragraph, bottom tagline badge) — see app/(site)/page.tsx for where these
 * render and lib/data/settings.ts getHeroCopy() for the fallback defaults.
 */
export function HeroCopyEditor({ initial }: { initial: HeroCopy }) {
  const [copy, setCopy] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const field = (key: keyof HeroCopy) => (value: string) => {
    setCopy((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    const result = await saveHeroCopyAction(copy);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSaved(true);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="hero-eyebrow">Eyebrow badge</Label>
        <Input id="hero-eyebrow" value={copy.eyebrow} onChange={(e) => field("eyebrow")(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="hero-headline">Headline</Label>
        <Input id="hero-headline" value={copy.headline} onChange={(e) => field("headline")(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="hero-paragraph">Paragraph</Label>
        <Textarea
          id="hero-paragraph"
          rows={3}
          value={copy.paragraph}
          onChange={(e) => field("paragraph")(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="hero-tagline">Bottom tagline badge</Label>
        <Input id="hero-tagline" value={copy.tagline} onChange={(e) => field("tagline")(e.target.value)} />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-sm border border-hull/30 bg-hull/5 px-3 py-2 text-hull">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span className="text-[12px]">{error}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="button" size="sm" disabled={saving} onClick={onSave}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : "Save hero copy"}
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
