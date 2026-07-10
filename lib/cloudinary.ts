import crypto from "crypto";

/**
 * Server-only signing for direct-to-Cloudinary uploads from the admin widget.
 * Files never touch our server; we just sign the upload params.
 */
export function signCloudinaryUpload(paramsToSign: Record<string, string | number>) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) throw new Error("CLOUDINARY_API_SECRET is not configured");

  const sorted = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(sorted + apiSecret)
    .digest("hex");

  return signature;
}

type CloudinaryImage = { publicId: string; alt: string; isPrimary?: boolean; type?: "photo" | "drawing" };

export function cloudinaryUrl(publicId: string, transform = "f_auto,q_auto,w_1200") {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
}

export function primaryImage(images: CloudinaryImage[]): CloudinaryImage | undefined {
  return images.find((img) => img.isPrimary) ?? images[0];
}
