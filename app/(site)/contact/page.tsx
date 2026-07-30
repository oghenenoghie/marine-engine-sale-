import type { Metadata } from "next";
import { MapPin, Phone, Mail } from "lucide-react";
import { EnquiryForm } from "@/components/forms/enquiry-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Shipcove Trading team.",
};

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    label: "Address",
    lines: ["Number 3 Olorunfuminike Close,", "Okun Ajah, Lagos, Nigeria"],
  },
  {
    icon: Phone,
    label: "Phone",
    lines: ["08133053197", "08113996181"],
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["Info@shipcovetrading.com"],
  },
];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ part?: string }> }) {
  const { part } = await searchParams;
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <span className="label text-steel">Contact</span>
      <h1 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">Get in touch</h1>
      <p className="mt-2 text-[14px] text-steel">
        Sourcing a specific part, or want to talk about a bulk order? Send us a message.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {CONTACT_DETAILS.map(({ icon: Icon, label, lines }) => (
          <div key={label} className="rounded-sm border border-steel/15 bg-white p-4">
            <Icon size={16} className="text-steel" />
            <div className="label mt-2 text-steel">{label}</div>
            <div className="mt-1 space-y-0.5">
              {lines.map((line) => (
                <p key={line} className="text-[13px] text-hull">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-sm border border-steel/15 bg-white p-6">
        <EnquiryForm type="rfq" stockTitle={part} />
      </div>
    </div>
  );
}
