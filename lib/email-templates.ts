import type { EnquiryType } from "@/types";

type ConfirmationEmailInput = {
  type: EnquiryType;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  attachmentsCount?: number;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function closingLine(type: EnquiryType) {
  return type === "rfq"
    ? "We'll come back to you with a quote within 24 hours."
    : "We'll come back with an offer within 24 hours.";
}

export function confirmationEmailText({ type, name, company, email, phone, message, attachmentsCount }: ConfirmationEmailInput) {
  const lines = [
    `Hi ${name},`,
    "",
    "Thanks for reaching out to Shipcove Trading. Here's a copy of what you submitted:",
    "",
    message,
  ];
  if (attachmentsCount) lines.push("", `Photos attached: ${attachmentsCount}`);
  lines.push("", `Name: ${name}${company ? ` (${company})` : ""}`, `Email: ${email}`);
  if (phone) lines.push(`Phone: ${phone}`);
  lines.push("", closingLine(type), "", "— Shipcove Trading");
  return lines.join("\n");
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shipcovetrading.com";

export function confirmationEmailHtml({ type, name, company, email, phone, message, attachmentsCount }: ConfirmationEmailInput) {
  const safeName = escapeHtml(name);
  const safeCompany = company ? escapeHtml(company) : undefined;
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : undefined;
  const safeMessage = escapeHtml(message);

  const detailRows = [
    { label: "Name", value: safeCompany ? `${safeName} (${safeCompany})` : safeName },
    { label: "Email", value: safeEmail },
    ...(safePhone ? [{ label: "Phone", value: safePhone }] : []),
  ]
    .map(
      (row, i) => `
      <tr>
        <td style="padding:10px 0;${i > 0 ? "border-top:1px solid #E4E4E2;" : ""}font-family:'IBM Plex Mono',Menlo,Consolas,monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8A8D92;width:88px;vertical-align:top;">
          ${row.label}
        </td>
        <td style="padding:10px 0;${i > 0 ? "border-top:1px solid #E4E4E2;" : ""}font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;font-size:13px;color:#0A0B0D;">
          ${row.value}
        </td>
      </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>We've received your ${type === "rfq" ? "enquiry" : "sell enquiry"}</title>
</head>
<body style="margin:0;padding:0;background-color:#FAFAF9;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF9;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border:1px solid #E4E4E2;">

          <tr>
            <td style="background-color:#0A0B0D;padding:24px 32px;">
              <span style="font-family:Archivo,Helvetica,Arial,sans-serif;font-size:15px;font-weight:800;letter-spacing:0.08em;color:#FAFAF9;text-transform:uppercase;">
                Shipcove Trading
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 32px 0;">
              <p style="margin:0;font-family:'IBM Plex Mono',Menlo,Consolas,monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#4B4E54;">
                Enquiry received
              </p>
              <h1 style="margin:8px 0 0;font-family:Archivo,Helvetica,Arial,sans-serif;font-size:24px;line-height:1.25;font-weight:800;color:#0A0B0D;">
                Thanks, ${safeName}.
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 32px 0;">
              <p style="margin:0;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#1D1F22;">
                Here's a copy of what you sent us. ${closingLine(type)}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E4E4E2;">
                <tr>
                  <td style="padding:16px 20px;font-family:'IBM Plex Mono',Menlo,Consolas,monospace;font-size:13px;line-height:1.6;color:#0A0B0D;white-space:pre-wrap;">${safeMessage}</td>
                </tr>
              </table>
              ${
                attachmentsCount
                  ? `<p style="margin:8px 2px 0;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;font-size:12px;color:#8A8D92;">Photos attached: ${attachmentsCount}</p>`
                  : ""
              }
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows}</table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#0A0B0D;">
                    <a href="${SITE_URL}/stock" style="display:inline-block;padding:12px 22px;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#FAFAF9;text-decoration:none;">
                      Browse in-stock parts &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 32px 32px;">
              <p style="margin:0;font-family:'IBM Plex Sans',Helvetica,Arial,sans-serif;font-size:13px;color:#4B4E54;">
                — Shipcove Trading
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#0A0B0D;padding:20px 32px;">
              <p style="margin:0;font-family:'IBM Plex Mono',Menlo,Consolas,monospace;font-size:11px;line-height:1.8;color:rgba(250,250,249,0.55);">
                Number 3 Olorunfuminike Close, Okun Ajah, Lagos, Nigeria<br />
                08133053197 &middot; 08113996181 &middot; Info@shipcovetrading.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
