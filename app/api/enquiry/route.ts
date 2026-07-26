import { NextResponse } from "next/server";
import { z } from "zod";
import { getResend } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/server";

const enquirySchema = z.object({
  type: z.enum(["rfq", "sell"]),
  stockItemId: z.string().optional(),
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  attachments: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid enquiry payload" }, { status: 400 });
  }
  const data = parsed.data;

  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();
    const { error } = await supabase.from("enquiries").insert({
      type: data.type,
      stock_item_id: data.stockItemId ?? null,
      name: data.name,
      company: data.company ?? null,
      email: data.email,
      phone: data.phone ?? null,
      message: data.message,
      attachments: data.attachments ?? [],
    });
    if (error) {
      return NextResponse.json({ error: "Could not save enquiry" }, { status: 500 });
    }
  } else {
    console.log("[enquiry] Supabase not configured — logging only:", data);
  }

  const resend = getResend();
  const notifyTo = process.env.ENQUIRY_NOTIFY_EMAIL || "sales@shipcovetrading.com";
  if (resend && notifyTo) {
    await resend.emails.send({
      from: "Shipcove Trading <sales@shipcovetrading.com>",
      to: notifyTo,
      replyTo: data.email,
      subject: `${data.type === "rfq" ? "New RFQ" : "New sell enquiry"} — ${data.name}`,
      text: [
        data.message,
        data.attachments?.length ? `\nPhotos:\n${data.attachments.join("\n")}` : "",
        `\n— ${data.name}${data.company ? ` (${data.company})` : ""}\n${data.email}${data.phone ? ` · ${data.phone}` : ""}`,
      ].join(""),
    });
  }

  return NextResponse.json({ ok: true });
}
