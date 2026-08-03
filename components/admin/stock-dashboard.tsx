"use client";

import { useMemo, useState } from "react";
import {
  Check, ChevronDown, Filter, ImageIcon, PenLine, Plus, Search, Ship, Trash2, X,
} from "lucide-react";
import { cn, formatPrice, slugify } from "@/lib/utils";
import { StatusBadge, STATUS_STYLE } from "@/components/stock/status-badge";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { saveStockItemAction, deleteStockItemAction } from "@/lib/actions/stock";
import type { Brand, Condition, Currency, EngineModel, PartCategory, ProductCategory, StockItem, StockStatus } from "@/types";
import { CURRENCIES } from "@/types";

/**
 * Admin Stock Dashboard (CRUD). Ported from the Drydock design prototype
 * into the app's Tailwind tokens + UI primitives. Initial items come from
 * Supabase (see app/admin/(protected)/stock/page.tsx); save/delete persist
 * via server actions in lib/actions/stock.ts, then update local state.
 */

const CONDITIONS: Condition[] = ["New", "Used", "Reconditioned"];
const STATUSES: StockStatus[] = ["available", "reserved", "sold", "expected"];

const uid = () => (typeof crypto !== "undefined" ? crypto.randomUUID() : String(Math.random()).slice(2));

interface StockDashboardProps {
  initialItems: StockItem[];
  brands: Brand[];
  models: EngineModel[];
  categories: PartCategory[];
  productCategories: ProductCategory[];
}

export function StockDashboard({ initialItems, brands, models, categories, productCategories }: StockDashboardProps) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [brandF, setBrandF] = useState("All");
  const [statusF, setStatusF] = useState("All");
  const [editing, setEditing] = useState<StockItem | Partial<StockItem> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StockItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const brandById = useMemo(() => Object.fromEntries(brands.map((b) => [b.id, b])), [brands]);
  const categoryById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const modelById = useMemo(() => Object.fromEntries(models.map((m) => [m.id, m])), [models]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const matchQ =
        !q ||
        it.title.toLowerCase().includes(q) ||
        it.sku.toLowerCase().includes(q) ||
        it.oemNumbers.some((n) => n.toLowerCase().includes(q));
      const matchB = brandF === "All" || it.brandId === brandF;
      const matchS = statusF === "All" || it.status === statusF;
      return matchQ && matchB && matchS;
    });
  }, [items, query, brandF, statusF]);

  const stats = useMemo(
    () => ({
      total: items.length,
      available: items.filter((i) => i.status === "available").length,
      reserved: items.filter((i) => i.status === "reserved").length,
      expected: items.filter((i) => i.status === "expected").length,
    }),
    [items],
  );

  const saveItem = async (data: StockItem) => {
    setSaving(true);
    setError(null);
    const result = await saveStockItemAction(data);
    if (result.ok) {
      setItems((prev) => (prev.some((i) => i.id === data.id) ? prev.map((i) => (i.id === data.id ? data : i)) : [data, ...prev]));
      setEditing(null);
    } else {
      setError(result.error);
    }
    setSaving(false);
  };
  const removeItem = async (id: string) => {
    setSaving(true);
    setError(null);
    const result = await deleteStockItemAction(id);
    if (result.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setDeleteTarget(null);
    } else {
      setError(result.error);
    }
    setSaving(false);
  };

  return (
    <div className="text-[14px] text-hull">
      {error && (
        <div className="border-b border-hull/30 bg-hull/5 px-6 py-2 text-[12px] font-medium text-hull">{error}</div>
      )}
      {/* Topbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-steel/15 px-6 py-4">
        <div>
          <div className="font-display text-xl font-extrabold tracking-tight">Stock</div>
          <div className="text-[12px] text-steel">Manage engines &amp; spare parts inventory</div>
        </div>
        <div className="relative ml-auto">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, SKU or OEM number…"
            className="w-64 rounded-md border border-steel/25 bg-white py-2 pl-9 pr-3 font-mono text-[12px] outline-none focus:ring-2 focus:ring-hull"
          />
        </div>
        <Button size="lg" onClick={() => setEditing({})}>
          <Plus size={18} /> Add item
        </Button>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Total items" value={stats.total} />
          <Stat label="Available" value={stats.available} />
          <Stat label="Reserved" value={stats.reserved} />
          <Stat label="Expected" value={stats.expected} />
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Filter size={15} className="text-steel" />
          <NativeSelect value={brandF} onChange={setBrandF} options={[["All", "All brands"], ...brands.map((b): [string, string] => [b.id, b.name])]} />
          <NativeSelect
            value={statusF}
            onChange={setStatusF}
            options={[["All", "All statuses"], ...STATUSES.map((s): [string, string] => [s, STATUS_STYLE[s].label])]}
          />
          <span className="ml-auto font-mono text-[12px] text-steel">
            {filtered.length} of {items.length}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-md border border-steel/15 bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-hull/5 text-[11px] uppercase tracking-wider text-steel">
                <th className="px-4 py-2.5 font-semibold">Item</th>
                <th className="hidden px-4 py-2.5 font-semibold lg:table-cell">SKU</th>
                <th className="hidden px-4 py-2.5 font-semibold md:table-cell">Brand / Model</th>
                <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Condition</th>
                <th className="px-4 py-2.5 text-right font-semibold">Price</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((it) => (
                <tr key={it.id} className="border-t border-steel/10">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded bg-hull/5 text-hull">
                        {it.type === "engine" ? <Ship size={16} /> : <ImageIcon size={16} />}
                      </div>
                      <div className="min-w-0">
                        <div className="max-w-[320px] truncate font-medium">{it.title}</div>
                        <div className="text-[11px] text-steel">
                          {categoryById[it.categoryId]?.name}
                          {it.qty ? ` · qty ${it.qty}` : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span className="font-mono text-[12px] text-steel">{it.sku}</span>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <div className="text-[13px]">{brandById[it.brandId]?.name}</div>
                    <div className="font-mono text-[11px] text-steel">{it.modelId ? modelById[it.modelId]?.name : "—"}</div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-[13px] text-steel">{it.condition}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-[13px] font-medium">{formatPrice(it.price, it.poa, it.currency)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={it.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <IconBtn onClick={() => setEditing(it)} title="Edit">
                        <PenLine size={15} />
                      </IconBtn>
                      <IconBtn onClick={() => setDeleteTarget(it)} title="Delete" danger>
                        <Trash2 size={15} />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-steel">
                    No items match your filters.{" "}
                    <button
                      onClick={() => {
                        setQuery("");
                        setBrandF("All");
                        setStatusF("All");
                      }}
                      className="font-medium text-hull underline"
                    >
                      Clear
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing !== null && (
        <StockForm
          initial={editing}
          brands={brands}
          models={models}
          categories={categories}
          productCategories={productCategories}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={saveItem}
        />
      )}
      {deleteTarget && (
        <ConfirmDelete
          item={deleteTarget}
          saving={saving}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => removeItem(deleteTarget.id)}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-steel/15 bg-white/70 px-4 py-3">
      <div className="label text-steel">{label}</div>
      <div className="mt-1 font-display text-2xl font-extrabold text-hull">{value}</div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-md border border-steel/25 transition-colors hover:bg-black/5",
        danger ? "text-hull" : "text-steel",
      )}
    >
      {children}
    </button>
  );
}

function NativeSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-md border border-steel/25 bg-white py-1.5 pl-3 pr-8 text-[12px] outline-none focus:ring-2 focus:ring-hull"
      >
        {options.map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-steel" />
    </div>
  );
}

// ---- Create / Edit slide-over ----
function StockForm({
  initial,
  brands,
  models,
  categories,
  productCategories,
  saving,
  onClose,
  onSave,
}: {
  initial: StockItem | Partial<StockItem>;
  brands: Brand[];
  models: EngineModel[];
  categories: PartCategory[];
  productCategories: ProductCategory[];
  saving: boolean;
  onClose: () => void;
  onSave: (item: StockItem) => void;
}) {
  const isNew = !initial.id;
  const [f, setF] = useState<StockItem>({
    id: initial.id ?? uid(),
    sku: initial.sku ?? "",
    title: initial.title ?? "",
    slug: initial.slug ?? "",
    type: initial.type ?? "part",
    brandId: initial.brandId ?? brands[0]?.id ?? "",
    modelId: initial.modelId ?? null,
    categoryId: initial.categoryId ?? categories[0]?.id ?? "",
    productCategoryId: initial.productCategoryId ?? null,
    condition: initial.condition ?? "Used",
    poa: initial.poa ?? false,
    price: initial.price ?? 0,
    currency: initial.currency ?? "EUR",
    qty: initial.qty ?? 1,
    status: initial.status ?? "available",
    oemNumbers: initial.oemNumbers ?? [],
    specs: initial.specs ?? {},
    images: initial.images ?? [],
    drawingId: initial.drawingId ?? null,
    description: initial.description ?? "",
    createdAt: initial.createdAt ?? new Date().toISOString(),
  });
  const [oemInput, setOemInput] = useState("");
  const set = <K extends keyof StockItem>(k: K, v: StockItem[K]) => setF((p) => ({ ...p, [k]: v }));

  const modelsForBrand = models.filter((m) => m.brandId === f.brandId);

  const addOem = () => {
    const v = oemInput.trim();
    if (v && !f.oemNumbers.includes(v)) set("oemNumbers", [...f.oemNumbers, v]);
    setOemInput("");
  };
  const specRows = Object.entries(f.specs);
  const setSpecKey = (i: number, key: string) => {
    const next = specRows.map(([k, v], idx) => (idx === i ? [key, v] : [k, v]));
    set("specs", Object.fromEntries(next));
  };
  const setSpecVal = (i: number, val: string) => {
    const next = specRows.map(([k, v], idx) => (idx === i ? [k, val] : [k, v]));
    set("specs", Object.fromEntries(next));
  };
  const addSpec = () => set("specs", { ...f.specs, "": "" });
  const removeSpec = (i: number) => set("specs", Object.fromEntries(specRows.filter((_, idx) => idx !== i)));

  const canSave = f.title.trim() && f.sku.trim();

  const handleSave = () => {
    if (!canSave) return;
    onSave({ ...f, slug: f.slug || slugify(`${f.sku} ${f.title}`) });
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-hull/45" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-steel/15 px-5 py-4">
          <div>
            <div className="label text-steel">{isNew ? "New" : "Edit"} · Stock</div>
            <div className="font-display text-lg font-extrabold tracking-tight">{isNew ? "Add stock item" : f.title || "Edit item"}</div>
          </div>
          <IconBtn onClick={onClose} title="Close">
            <X size={16} />
          </IconBtn>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <Field label="Title">
            <input
              value={f.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Cylinder head — Wärtsilä 32"
              className="w-full rounded-md border border-steel/25 bg-white px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-hull"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="SKU">
              <input
                value={f.sku}
                onChange={(e) => set("sku", e.target.value)}
                placeholder="WRT-32-CH-000"
                className="w-full rounded-md border border-steel/25 bg-white px-3 py-2 font-mono text-[13px] outline-none focus:ring-2 focus:ring-hull"
              />
            </Field>
            <Field label="Type">
              <Picker
                value={f.type}
                onChange={(v) => set("type", v as StockItem["type"])}
                options={[
                  ["part", "Part"],
                  ["engine", "Engine"],
                ]}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Brand">
              <SelectField
                value={f.brandId}
                onChange={(v) => set("brandId", v)}
                options={brands.map((b): [string, string] => [b.id, b.name])}
              />
            </Field>
            <Field label="Model">
              <SelectField
                value={f.modelId ?? ""}
                onChange={(v) => set("modelId", v || null)}
                options={[["", "—"], ...modelsForBrand.map((m): [string, string] => [m.id, m.name])]}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <SelectField
                value={f.categoryId}
                onChange={(v) => set("categoryId", v)}
                options={categories.map((c): [string, string] => [c.id, c.name])}
              />
            </Field>
            <Field label="Condition">
              <SelectField value={f.condition} onChange={(v) => set("condition", v as Condition)} options={CONDITIONS.map((c): [string, string] => [c, c])} />
            </Field>
          </div>
          <Field label="Product category">
            <SelectField
              value={f.productCategoryId ?? ""}
              onChange={(v) => set("productCategoryId", v || null)}
              options={[["", "—"], ...productCategories.map((c): [string, string] => [c.id, c.name])]}
            />
          </Field>

          <Field label="Price">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] text-steel">
                <input type="checkbox" checked={f.poa} onChange={(e) => set("poa", e.target.checked)} />
                POA (price on application)
              </label>
              {!f.poa && (
                <div className="flex gap-2">
                  <div className="w-24">
                    <SelectField
                      value={f.currency}
                      onChange={(v) => set("currency", v as Currency)}
                      options={CURRENCIES.map((c): [string, string] => [c, c])}
                    />
                  </div>
                  <input
                    type="number"
                    value={f.price ?? 0}
                    onChange={(e) => set("price", Number(e.target.value))}
                    className="w-full flex-1 rounded-md border border-steel/25 bg-white px-3 py-2 font-mono text-[13px] outline-none focus:ring-2 focus:ring-hull"
                  />
                </div>
              )}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity">
              <input
                type="number"
                value={f.qty}
                onChange={(e) => set("qty", Number(e.target.value))}
                className="w-full rounded-md border border-steel/25 bg-white px-3 py-2 font-mono text-[13px] outline-none focus:ring-2 focus:ring-hull"
              />
            </Field>
            <Field label="Status">
              <SelectField value={f.status} onChange={(v) => set("status", v as StockStatus)} options={STATUSES.map((s): [string, string] => [s, STATUS_STYLE[s].label])} />
            </Field>
          </div>

          <Field label="OEM numbers">
            <div className="flex flex-wrap gap-1.5">
              {f.oemNumbers.map((n) => (
                <span key={n} className="flex items-center gap-1 rounded bg-hull/5 px-2 py-0.5 font-mono text-[12px] text-hull">
                  {n}
                  <button onClick={() => set("oemNumbers", f.oemNumbers.filter((x) => x !== n))}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={oemInput}
                onChange={(e) => setOemInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOem())}
                placeholder="Add number + Enter"
                className="flex-1 rounded-md border border-steel/25 bg-white px-3 py-1.5 font-mono text-[12px] outline-none focus:ring-2 focus:ring-hull"
              />
              <button onClick={addOem} className="rounded-md border border-steel/25 px-3 text-[12px] text-steel">
                Add
              </button>
            </div>
          </Field>

          <Field label="Specifications">
            <div className="space-y-2">
              {specRows.map(([k, v], i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={k}
                    onChange={(e) => setSpecKey(i, e.target.value)}
                    placeholder="Bore"
                    className="w-1/3 rounded-md border border-steel/25 bg-white px-2 py-1.5 text-[12px] outline-none focus:ring-2 focus:ring-hull"
                  />
                  <input
                    value={v}
                    onChange={(e) => setSpecVal(i, e.target.value)}
                    placeholder="320 mm"
                    className="flex-1 rounded-md border border-steel/25 bg-white px-2 py-1.5 font-mono text-[12px] outline-none focus:ring-2 focus:ring-hull"
                  />
                  <button onClick={() => removeSpec(i)} className="text-steel">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button onClick={addSpec} className="text-[12px] font-medium text-hull underline underline-offset-2">
                + Add spec
              </button>
            </div>
          </Field>

          <Field label="Photos">
            <ImageUploader images={f.images} onChange={(images) => set("images", images)} />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-steel/15 px-5 py-4">
          <button onClick={onClose} className="rounded-md border border-steel/25 px-4 py-2 text-[13px] font-medium text-steel">
            Cancel
          </button>
          <Button onClick={handleSave} disabled={!canSave || saving} variant="dark">
            <Check size={15} /> {saving ? "Saving…" : isNew ? "Create item" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label mb-1 text-steel">{label}</div>
      {children}
    </div>
  );
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-steel/25 bg-white px-3 py-2 pr-8 text-[13px] outline-none focus:ring-2 focus:ring-hull"
      >
        {options.map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-steel" />
    </div>
  );
}

function Picker({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="flex gap-1.5">
      {options.map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            "flex-1 rounded-md border py-2 text-[13px] font-medium",
            value === v ? "border-hull bg-hull text-white" : "border-steel/25 bg-white text-steel",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ConfirmDelete({
  item,
  saving,
  onCancel,
  onConfirm,
}: {
  item: StockItem;
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-hull/50 p-4" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-lg bg-paper p-5 shadow-2xl">
        <div className="mb-1 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-hull/10 text-hull">
            <Trash2 size={16} />
          </div>
          <div className="font-display text-base font-extrabold">Delete item?</div>
        </div>
        <p className="mt-2 text-[13px] text-steel">
          <span className="font-mono">{item.sku}</span> — {item.title}. This can&apos;t be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-md border border-steel/25 px-4 py-2 text-[13px] font-medium text-steel">
            Cancel
          </button>
          <Button variant="primary" onClick={onConfirm} disabled={saving}>
            {saving ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
