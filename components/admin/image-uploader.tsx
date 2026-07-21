"use client";

import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget, type CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { AlertTriangle, Star, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { StockImage } from "@/types";

const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Drag-drop / click-to-upload widget for stock photography, wired directly
 * to Cloudinary (files never touch our server). Uses the unsigned preset —
 * see NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.example.
 */
export function ImageUploader({
  images,
  onChange,
  folder = "drydock/stock",
}: {
  images: StockImage[];
  onChange: (images: StockImage[]) => void;
  folder?: string;
}) {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const addImage = (info: CloudinaryUploadWidgetInfo) => {
    const next: StockImage = {
      publicId: info.public_id,
      alt: info.original_filename ?? "Stock photo",
      isPrimary: images.length === 0,
      type: "photo",
    };
    onChange([...images, next]);
  };

  const removeImage = (publicId: string) => {
    const filtered = images.filter((img) => img.publicId !== publicId);
    if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
      filtered[0]!.isPrimary = true;
    }
    onChange(filtered);
  };

  const makePrimary = (publicId: string) => {
    onChange(images.map((img) => ({ ...img, isPrimary: img.publicId === publicId })));
  };

  if (!UPLOAD_PRESET || !CLOUD_NAME) {
    const missing = [
      !CLOUD_NAME && "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
      !UPLOAD_PRESET && "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
    ].filter((v): v is string => Boolean(v));
    return (
      <div className="flex items-start gap-2 rounded-md border border-dashed border-steel/25 px-3 py-3 text-steel">
        <Upload size={16} className="mt-0.5 shrink-0" />
        <span className="text-[12px]">
          Set {missing.map((v, i) => (
            <span key={v}>
              <code className="font-mono">{v}</code>
              {i < missing.length - 1 ? " and " : ""}
            </span>
          ))}{" "}
          to enable image uploads.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img) => (
            <div
              key={img.publicId}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-md border",
                img.isPrimary ? "border-signal" : "border-steel/20",
              )}
            >
              <Image src={img.publicId} alt={img.alt} fill className="object-cover" />
              <div className="absolute inset-0 flex items-start justify-between bg-hull/0 p-1 opacity-0 transition-opacity group-hover:bg-hull/40 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => makePrimary(img.publicId)}
                  title="Set as primary photo"
                  className={cn(
                    "grid h-6 w-6 place-items-center rounded-full bg-white/90",
                    img.isPrimary ? "text-signal" : "text-steel",
                  )}
                >
                  <Star size={12} fill={img.isPrimary ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(img.publicId)}
                  title="Remove photo"
                  className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-signal"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              {img.isPrimary && (
                <span className="absolute bottom-1 left-1 rounded bg-signal px-1.5 py-0.5 text-[9px] font-semibold uppercase text-white">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {uploadError && (
        <div className="flex items-start gap-2 rounded-md border border-signal/30 bg-signal/10 px-3 py-2 text-signal">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span className="text-[12px]">{uploadError}</span>
        </div>
      )}

      <CldUploadWidget
        uploadPreset={UPLOAD_PRESET}
        options={{
          multiple: true,
          maxFiles: 12,
          folder,
          sources: ["local", "camera", "url"],
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "heic"],
          maxFileSize: 10_000_000,
        }}
        onOpen={() => setUploadError(null)}
        onSuccess={(result) => {
          const info = result.info;
          if (info && typeof info !== "string") addImage(info);
        }}
        onError={(error) => {
          setUploadError(typeof error === "string" ? error : "Upload failed — see browser console for details.");
          console.error("[ImageUploader] Cloudinary upload error", error);
        }}
      >
        {({ open }) => (
          <Button type="button" variant="outline" size="sm" onClick={() => open()} className="w-full bg-white">
            <Upload size={14} /> Upload photos
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}
