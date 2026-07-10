"use client";

import Image from "next/image";
import { CldUploadWidget, type CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Upload, X } from "lucide-react";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";

const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/** Lets a seller attach photos of their equipment before submitting the sell enquiry. */
export function PhotoUploader({ publicIds, onChange }: { publicIds: string[]; onChange: (ids: string[]) => void }) {
  if (!UPLOAD_PRESET) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-dashed border-steel/25 px-3 py-3 text-steel">
        <Upload size={16} className="mt-0.5 shrink-0" />
        <span className="text-[12px]">Photo upload is not configured yet — reply-all any photos to the confirmation email.</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {publicIds.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {publicIds.map((id) => (
            <div key={id} className="group relative aspect-square overflow-hidden rounded-md border border-steel/20">
              <Image src={cloudinaryUrl(id, "f_auto,q_auto,w_200")} alt="Uploaded equipment photo" fill className="object-cover" />
              <button
                type="button"
                onClick={() => onChange(publicIds.filter((p) => p !== id))}
                className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-hull/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <CldUploadWidget
        uploadPreset={UPLOAD_PRESET}
        options={{ multiple: true, maxFiles: 12, folder: "drydock/sell-enquiries", sources: ["local", "camera"] }}
        onSuccess={(result) => {
          const info = result.info;
          if (info && typeof info !== "string") onChange([...publicIds, info.public_id]);
        }}
      >
        {({ open }) => (
          <Button type="button" variant="outline" size="sm" onClick={() => open()} className="w-full bg-white">
            <Upload size={14} /> Add photos
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}
