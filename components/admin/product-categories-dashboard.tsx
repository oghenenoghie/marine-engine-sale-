"use client";

import { useState } from "react";
import { Check, PenLine, Plus, Trash2, X } from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { saveProductCategoryAction, deleteProductCategoryAction } from "@/lib/actions/taxonomy";
import type { ProductCategory } from "@/types";

const uid = () => (typeof crypto !== "undefined" ? crypto.randomUUID() : String(Math.random()).slice(2));

export function ProductCategoriesDashboard({ initialCategories }: { initialCategories: ProductCategory[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [editing, setEditing] = useState<ProductCategory | Partial<ProductCategory> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (category: ProductCategory) => {
    setSaving(true);
    setError(null);
    const result = await saveProductCategoryAction(category);
    if (result.ok) {
      setCategories((prev) =>
        prev.some((c) => c.id === category.id) ? prev.map((c) => (c.id === category.id ? category : c)) : [...prev, category],
      );
      setEditing(null);
    } else {
      setError(result.error);
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    setSaving(true);
    setError(null);
    const result = await deleteProductCategoryAction(id);
    if (result.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeleteTarget(null);
    } else {
      setError(result.error);
    }
    setSaving(false);
  };

  return (
    <div className="text-[14px] text-hull">
      {error && <div className="mb-4 rounded-md border border-signal/30 bg-signal/10 px-4 py-2 text-[12px] text-signal">{error}</div>}

      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="font-display text-xl font-extrabold tracking-tight">Product categories</div>
          <div className="text-[12px] text-steel">Top-level catalog sections (Engines, Spare Parts, Gensets…) used to group stock items</div>
        </div>
        <Button onClick={() => setEditing({})}>
          <Plus size={16} /> Add product category
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border border-steel/15 bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-hull/5 text-[11px] uppercase tracking-wider text-steel">
              <th className="px-4 py-2.5 font-semibold">Name</th>
              <th className="px-4 py-2.5 font-semibold">Slug</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-steel/10">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 font-mono text-[12px] text-steel">{c.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <IconBtn onClick={() => setEditing(c)} title="Edit">
                      <PenLine size={15} />
                    </IconBtn>
                    <IconBtn onClick={() => setDeleteTarget(c)} title="Delete" danger>
                      <Trash2 size={15} />
                    </IconBtn>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-steel">
                  No product categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing !== null && (
        <ProductCategoryForm initial={editing} saving={saving} onClose={() => setEditing(null)} onSave={save} />
      )}
      {deleteTarget && (
        <ConfirmDelete
          label={deleteTarget.name}
          saving={saving}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => remove(deleteTarget.id)}
        />
      )}
    </div>
  );
}

function ProductCategoryForm({
  initial,
  saving,
  onClose,
  onSave,
}: {
  initial: ProductCategory | Partial<ProductCategory>;
  saving: boolean;
  onClose: () => void;
  onSave: (category: ProductCategory) => void;
}) {
  const isNew = !initial.id;
  const [name, setName] = useState(initial.name ?? "");
  const [slug, setSlug] = useState(initial.slug ?? "");
  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ id: initial.id ?? uid(), name: name.trim(), slug: slug.trim() || slugify(name) });
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-hull/45" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-steel/15 px-5 py-4">
          <div className="font-display text-lg font-extrabold tracking-tight">{isNew ? "New product category" : "Edit product category"}</div>
          <IconBtn onClick={onClose} title="Close">
            <X size={16} />
          </IconBtn>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <Field label="Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Gensets"
              className="w-full rounded-md border border-steel/25 bg-white px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-blueprint"
            />
          </Field>
          <Field label="Slug">
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={slugify(name) || "gensets"}
              className="w-full rounded-md border border-steel/25 bg-white px-3 py-2 font-mono text-[13px] outline-none focus:ring-2 focus:ring-blueprint"
            />
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-steel/15 px-5 py-4">
          <button onClick={onClose} className="rounded-md border border-steel/25 px-4 py-2 text-[13px] font-medium text-steel">
            Cancel
          </button>
          <Button onClick={handleSave} disabled={!canSave || saving} variant="dark">
            <Check size={15} /> {saving ? "Saving…" : isNew ? "Create" : "Save changes"}
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
        danger ? "text-signal" : "text-steel",
      )}
    >
      {children}
    </button>
  );
}

function ConfirmDelete({
  label,
  saving,
  onCancel,
  onConfirm,
}: {
  label: string;
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-hull/50 p-4" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-lg bg-paper p-5 shadow-2xl">
        <div className="mb-1 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-signal/15 text-signal">
            <Trash2 size={16} />
          </div>
          <div className="font-display text-base font-extrabold">Delete product category?</div>
        </div>
        <p className="mt-2 text-[13px] text-steel">{label}. This can&apos;t be undone.</p>
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
