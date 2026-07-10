"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function PartNumberSearch({ className }: { className?: string }) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/parts?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={submit} className={cn("relative", className)}>
      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search OEM part number…"
        aria-label="Search by OEM part number"
        className="w-full rounded-md border border-steel/25 bg-white py-2 pl-9 pr-3 font-mono text-[12px] text-hull outline-none placeholder:text-steel/60 focus:ring-2 focus:ring-blueprint"
      />
    </form>
  );
}
