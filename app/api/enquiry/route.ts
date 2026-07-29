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
  const kind = data.type === "rfq" ? "enquiry" : "sell enquiry";

  if (resend) {
    // The enquiry is already saved above regardless of either email's outcome —
    // both sends are best-effort notification, so a failure here shouldn't fail
    // the request the visitor sees, but it must not fail silently either.
    const { error: notifyError } = await resend.emails.send({
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
    if (notifyError) {
      console.error("[enquiry] Recipient notification failed — enquiry was still saved", notifyError, { type: data.type, to: notifyTo });
    }

    // Confirmation copy back to the customer, recapping exactly what they
    // submitted — separate send so a failure on one side doesn't affect the other.
    const confirmationLines = [
      `Hi ${data.name},`,
      "",
      `Thanks for reaching out to Shipcove Trading. Here's a copy of what you submitted:`,
      "",
      data.message,
    ];
    if (data.attachments?.length) confirmationLines.push("", `Photos attached: ${data.attachments.length}`);
    confirmationLines.push("", `Name: ${data.name}${data.company ? ` (${data.company})` : ""}`, `Email: ${data.email}`);
    if (data.phone) confirmationLines.push(`Phone: ${data.phone}`);
    confirmationLines.push(
      "",
      data.type === "rfq"
        ? "We'll come back to you with a quote within 24 hours."
        : "We'll come back with an offer within 24 hours.",
      "",
      "— Shipcove Trading",
    );

    const { error: confirmError } = await resend.emails.send({
      from: "Shipcove Trading <sales@shipcovetrading.com>",
      to: data.email,
      replyTo: notifyTo,
      subject: `We've received your ${kind} — Shipcove Trading`,
      text: confirmationLines.join("\n"),
    });
    if (confirmError) {
      console.error("[enquiry] Customer confirmation email failed — enquiry was still saved", confirmError, { type: data.type, to: data.email });
    }
  } else {
    console.warn("[enquiry] RESEND_API_KEY not set — recipient notification and customer confirmation both skipped", {
      type: data.type,
      email: data.email,
    });
  }

  return NextResponse.json({ ok: true });
}
