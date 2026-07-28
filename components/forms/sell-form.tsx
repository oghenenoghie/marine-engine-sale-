"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PhotoUploader } from "@/components/forms/photo-uploader";
import { cn } from "@/lib/utils";
import type { Brand } from "@/types";

export function SellForm({ brands, className }: { brands: Brand[]; className?: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [photos, setPhotos] = useState<string[]>([]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    const brand = form.get("brand");
    const model = form.get("model");
    const condition = form.get("condition");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "sell",
          name: form.get("name"),
          company: form.get("company"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: `Brand: ${brand}\nModel: ${model}\nCondition: ${condition}\n\n${form.get("message") ?? ""}`,
          attachments: photos,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className={cn("flex items-center gap-2 rounded-sm border border-hull/20 bg-hull/[0.03] px-4 py-3 text-[13px] font-medium text-hull", className)}>
        <Check size={16} className="shrink-0" /> Received — we respond to every sell enquiry within 24 hours.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="brand">Brand</Label>
          <select
            id="brand"
            name="brand"
            required
            defaultValue=""
            className="w-full rounded-sm border border-steel/25 bg-white px-3 py-2 text-[13px] outline-none transition-colors focus:border-hull focus:ring-2 focus:ring-hull"
          >
            <option value="" disabled>
              Select brand
            </option>
            {brands.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <Input id="model" name="model" placeholder="e.g. VASA 32" required />
        </div>
      </div>

      <div>
        <Label htmlFor="condition">Condition</Label>
        <select
          id="condition"
          name="condition"
          required
          defaultValue=""
          className="w-full rounded-sm border border-steel/25 bg-white px-3 py-2 text-[13px] outline-none transition-colors focus:border-hull focus:ring-2 focus:ring-hull"
        >
          <option value="" disabled>
            Select condition
          </option>
          <option>New</option>
          <option>Used</option>
          <option>Reconditioned</option>
          <option>Decommissioned</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Details</Label>
        <Textarea id="message" name="message" rows={4} placeholder="Hours run, location, reason for sale…" />
      </div>

      <div>
        <Label>Photos</Label>
        <PhotoUploader photoUrls={photos} onChange={setPhotos} />
      </div>

      <Button type="submit" disabled={status === "submitting"} className="w-full">
        {status === "submitting" ? "Sending…" : "Submit sell enquiry"}
      </Button>
      {status === "error" && <p className="text-[12px] font-medium text-hull">Something went wrong — please try again.</p>}
    </form>
  );
}
