"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import type { Brand, Condition, StockStatus } from "@/types";

const CONDITIONS: Condition[] = ["New", "Used", "Reconditioned"];
const STATUSES: StockStatus[] = ["available", "reserved", "expected", "sold"];

export function FacetRail({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const FACETS = [
    { key: "brand", label: "Brand", values: brands.map((b) => ({ value: b.slug, label: b.name })) },
    { key: "condition", label: "Condition", values: CONDITIONS.map((c) => ({ value: c, label: c })) },
    { key: "status", label: "Status", values: STATUSES.map((s) => ({ value: s, label: s[0]!.toUpperCase() + s.slice(1) })) },
  ];

  const toggle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clear = () => router.push(pathname);
  const hasFilters = FACETS.some((f) => searchParams.has(f.key)) || searchParams.has("q");

  return (
    <aside className="w-full shrink-0 md:w-56">
      <div className="mb-3 flex items-center justify-between">
        <span className="label text-steel">Filters</span>
        {hasFilters && (
          <button onClick={clear} className="text-[12px] font-medium text-hull underline underline-offset-2">
            Clear
          </button>
        )}
      </div>
      <Accordion type="multiple" defaultValue={FACETS.map((f) => f.key)}>
        {FACETS.map((facet) => (
          <AccordionItem key={facet.key} value={facet.key}>
            <AccordionTrigger>{facet.label}</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {facet.values.map((v) => {
                  const checked = searchParams.get(facet.key) === v.value;
                  return (
                    <li key={v.value}>
                      <label className="flex cursor-pointer items-center gap-2 text-[13px] text-hull">
                        <Checkbox checked={checked} onCheckedChange={() => toggle(facet.key, v.value)} />
                        {v.label}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
}
