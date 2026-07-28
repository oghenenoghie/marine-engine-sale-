"use client";

import { useState } from "react";
import { Check, PenLine, Plus, Trash2, X } from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { saveBrandAction, deleteBrandAction, saveModelAction, deleteModelAction } from "@/lib/actions/taxonomy";
import type { Brand, EngineModel } from "@/types";

const uid = () => (typeof crypto !== "undefined" ? crypto.randomUUID() : String(Math.random()).slice(2));

export function BrandsDashboard({ initialBrands, initialModels }: { initialBrands: Brand[]; initialModels: EngineModel[] }) {
  const [brands, setBrands] = useState(initialBrands);
  const [models, setModels] = useState(initialModels);
  const [editingBrand, setEditingBrand] = useState<Brand | Partial<Brand> | null>(null);
  const [editingModel, setEditingModel] = useState<{ brandId: string; model: EngineModel | Partial<EngineModel> } | null>(null);
  const [deleteBrandTarget, setDeleteBrandTarget] = useState<Brand | null>(null);
  const [deleteModelTarget, setDeleteModelTarget] = useState<EngineModel | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveBrand = async (brand: Brand) => {
    setSaving(true);
    setError(null);
    const result = await saveBrandAction(brand);
    if (result.ok) {
      setBrands((prev) => (prev.some((b) => b.id === brand.id) ? prev.map((b) => (b.id === brand.id ? brand : b)) : [...prev, brand]));
      setEditingBrand(null);
    } else {
      setError(result.error);
    }
    setSaving(false);
  };

  const removeBrand = async (id: string) => {
    setSaving(true);
    setError(null);
    const result = await deleteBrandAction(id);
    if (result.ok) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
      setDeleteBrandTarget(null);
    } else {
      setError(result.error);
    }
    setSaving(false);
  };

  const saveModel = async (model: EngineModel) => {
    setSaving(true);
    setError(null);
    const result = await saveModelAction(model);
    if (result.ok) {
      setModels((prev) => (prev.some((m) => m.id === model.id) ? prev.map((m) => (m.id === model.id ? model : m)) : [...prev, model]));
      setEditingModel(null);
    } else {
      setError(result.error);
    }
    setSaving(false);
  };

  const removeModel = async (id: string) => {
    setSaving(true);
    setError(null);
    const result = await deleteModelAction(id);
    if (result.ok) {
      setModels((prev) => prev.filter((m) => m.id !== id));
      setDeleteModelTarget(null);
    } else {
      setError(result.error);
    }
    setSaving(false);
  };

  return (
    <div className="text-[14px] text-hull">
      {error && <div className="mb-4 rounded-sm border border-hull/30 bg-hull/5 px-4 py-2 text-[12px] font-medium text-hull">{error}</div>}

      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="font-display text-xl font-extrabold tracking-tight">Brands</div>
          <div className="text-[12px] text-steel">Manage brands and engine models</div>
        </div>
        <Button onClick={() => setEditingBrand({})}>
          <Plus size={16} /> Add brand
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {brands.map((brand) => (
          <div key={brand.id} className="rounded-sm border border-steel/15 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-display text-base font-bold text-hull">{brand.name}</div>
                <p className="mt-1 text-[12px] text-steel">{brand.blurb}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <IconBtn onClick={() => setEditingBrand(brand)} title="Edit brand">
                  <PenLine size={14} />
                </IconBtn>
                <IconBtn onClick={() => setDeleteBrandTarget(brand)} title="Delete brand" danger>
                  <Trash2 size={14} />
                </IconBtn>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {models
                .filter((m) => m.brandId === brand.id)
                .map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setEditingModel({ brandId: brand.id, model: m })}
                    className="rounded-sm border border-steel/25 bg-white px-2 py-0.5 font-mono text-[11px] text-hull hover:border-hull"
                  >
                    {m.name}
                  </button>
                ))}
              <button
                onClick={() => setEditingModel({ brandId: brand.id, model: { brandId: brand.id } })}
                className="rounded-sm border border-dashed border-steel/30 px-2 py-0.5 text-[11px] text-steel hover:border-hull hover:text-hull"
              >
                + Add model
              </button>
            </div>
          </div>
        ))}
        {brands.length === 0 && <p className="text-[13px] text-steel">No brands yet.</p>}
      </div>

      {editingBrand !== null && (
        <BrandForm initial={editingBrand} saving={saving} onClose={() => setEditingBrand(null)} onSave={saveBrand} />
      )}
      {editingModel !== null && (
        <ModelForm
          brandId={editingModel.brandId}
          initial={editingModel.model}
          saving={saving}
          onClose={() => setEditingModel(null)}
          onSave={saveModel}
        />
      )}
      {deleteBrandTarget && (
        <ConfirmDelete
          label={`${deleteBrandTarget.name} and every model under it`}
          saving={saving}
          onCancel={() => setDeleteBrandTarget(null)}
          onConfirm={() => removeBrand(deleteBrandTarget.id)}
        />
      )}
      {deleteModelTarget && (
        <ConfirmDelete
          label={deleteModelTarget.name}
          saving={saving}
          onCancel={() => setDeleteModelTarget(null)}
          onConfirm={() => removeModel(deleteModelTarget.id)}
        />
      )}
    </div>
  );
}

function BrandForm({
  initial,
  saving,
  onClose,
  onSave,
}: {
  initial: Brand | Partial<Brand>;
  saving: boolean;
  onClose: () => void;
  onSave: (brand: Brand) => void;
}) {
  const isNew = !initial.id;
  const [name, setName] = useState(initial.name ?? "");
  const [slug, setSlug] = useState(initial.slug ?? "");
  const [blurb, setBlurb] = useState(initial.blurb ?? "");
  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ id: initial.id ?? uid(), name: name.trim(), slug: slug.trim() || slugify(name), blurb: blurb.trim() || undefined });
  };

  return (
    <SlideOver title={isNew ? "New brand" : "Edit brand"} onClose={onClose}>
      <Field label="Name">
        <TextInput value={name} onChange={setName} placeholder="Wärtsilä" />
      </Field>
      <Field label="Slug">
        <TextInput value={slug} onChange={setSlug} placeholder={slugify(name) || "wartsila"} mono />
      </Field>
      <Field label="Description">
        <textarea
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          rows={3}
          className="w-full rounded-sm border border-steel/25 bg-white px-3 py-2 text-[13px] outline-none transition-colors focus:border-hull focus:ring-2 focus:ring-hull"
        />
      </Field>
      <SaveBar saving={saving} disabled={!canSave} isNew={isNew} onClose={onClose} onSave={handleSave} />
    </SlideOver>
  );
}

function ModelForm({
  brandId,
  initial,
  saving,
  onClose,
  onSave,
}: {
  brandId: string;
  initial: EngineModel | Partial<EngineModel>;
  saving: boolean;
  onClose: () => void;
  onSave: (model: EngineModel) => void;
}) {
  const isNew = !initial.id;
  const [name, setName] = useState(initial.name ?? "");
  const [slug, setSlug] = useState(initial.slug ?? "");
  const [bore, setBore] = useState(initial.bore ?? "");
  const [stroke, setStroke] = useState(initial.stroke ?? "");
  const [config, setConfig] = useState(initial.config ?? "");
  const [powerRange, setPowerRange] = useState(initial.powerRange ?? "");
  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: initial.id ?? uid(),
      brandId,
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      bore: bore.trim() || undefined,
      stroke: stroke.trim() || undefined,
      config: config.trim() || undefined,
      powerRange: powerRange.trim() || undefined,
    });
  };

  return (
    <SlideOver title={isNew ? "New model" : "Edit model"} onClose={onClose}>
      <Field label="Name">
        <TextInput value={name} onChange={setName} placeholder="VASA 32" />
      </Field>
      <Field label="Slug">
        <TextInput value={slug} onChange={setSlug} placeholder={slugify(name) || "vasa-32"} mono />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Bore">
          <TextInput value={bore} onChange={setBore} placeholder="320 mm" mono />
        </Field>
        <Field label="Stroke">
          <TextInput value={stroke} onChange={setStroke} placeholder="350 mm" mono />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Configuration">
          <TextInput value={config} onChange={setConfig} placeholder="In-line 6-9" />
        </Field>
        <Field label="Power range">
          <TextInput value={powerRange} onChange={setPowerRange} placeholder="2280–4830 kW" mono />
        </Field>
      </div>
      <SaveBar saving={saving} disabled={!canSave} isNew={isNew} onClose={onClose} onSave={handleSave} />
    </SlideOver>
  );
}

// ---- shared small pieces ----

function SlideOver({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-hull/45" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-steel/15 px-5 py-4">
          <div className="font-display text-lg font-extrabold tracking-tight">{title}</div>
          <IconBtn onClick={onClose} title="Close">
            <X size={16} />
          </IconBtn>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

function SaveBar({
  saving,
  disabled,
  isNew,
  onClose,
  onSave,
}: {
  saving: boolean;
  disabled: boolean;
  isNew: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-steel/15 pt-4">
      <button onClick={onClose} className="rounded-sm border border-steel/25 px-4 py-2 text-[13px] font-medium text-steel transition-colors hover:border-hull hover:text-hull">
        Cancel
      </button>
      <Button onClick={onSave} disabled={disabled || saving} variant="dark">
        <Check size={15} /> {saving ? "Saving…" : isNew ? "Create" : "Save changes"}
      </Button>
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

function TextInput({
  value,
  onChange,
  placeholder,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-sm border border-steel/25 bg-white px-3 py-2 text-[13px] outline-none transition-colors focus:border-hull focus:ring-2 focus:ring-hull",
        mono && "font-mono",
      )}
    />
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
        "grid h-8 w-8 place-items-center rounded-sm border border-steel/25 transition-colors hover:bg-black/5",
        danger ? "text-hull" : "text-steel",
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
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-sm bg-paper p-5 shadow-2xl">
        <div className="mb-1 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-hull/10 text-hull">
            <Trash2 size={16} />
          </div>
          <div className="font-display text-base font-extrabold">Delete?</div>
        </div>
        <p className="mt-2 text-[13px] text-steel">{label}. This can&apos;t be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-sm border border-steel/25 px-4 py-2 text-[13px] font-medium text-steel transition-colors hover:border-hull hover:text-hull">
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
