import { NextResponse } from "next/server";
import { signCloudinaryUpload } from "@/lib/cloudinary";

/**
 * Signs a Cloudinary upload for the admin widget (signed, non-public preset).
 * The file is uploaded directly from the browser to Cloudinary — this route
 * never touches the file itself, only the signature.
 */
export async function POST(request: Request) {
  const { folder = "drydock/stock" } = await request.json().catch(() => ({}));

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder };

  try {
    const signature = signCloudinaryUpload(paramsToSign);
    return NextResponse.json({
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
  } catch {
    return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 });
  }
}
