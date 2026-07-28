"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EnquiryType } from "@/types";

export function EnquiryForm({
  type,
  stockItemId,
  stockTitle,
  className,
}: {
  type: EnquiryType;
  stockItemId?: string;
  stockTitle?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          stockItemId,
          name: form.get("name"),
          company: form.get("company"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: form.get("message"),
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
        <Check size={16} className="shrink-0" /> Thanks — we&apos;ll reply within 24 hours.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-3", className)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
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
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          required
          defaultValue={stockTitle ? `Enquiry about: ${stockTitle}\n\n` : undefined}
        />
      </div>
      <Button type="submit" disabled={status === "submitting"} className="w-full">
        {status === "submitting" ? "Sending…" : "Send enquiry"}
      </Button>
      {status === "error" && <p className="text-[12px] font-medium text-hull">Something went wrong — please try again.</p>}
    </form>
  );
}
