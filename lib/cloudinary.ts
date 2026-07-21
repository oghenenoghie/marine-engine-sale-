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
