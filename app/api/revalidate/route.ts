import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand ISR revalidation, called after admin CRUD mutations once the
 * app is wired to Supabase. Protect with REVALIDATE_SECRET in production.
 */
export async function POST(request: Request) {
  const { path, secret } = await request.json().catch(() => ({}));

  if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  if (!path || typeof path !== "string") {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path });
}
