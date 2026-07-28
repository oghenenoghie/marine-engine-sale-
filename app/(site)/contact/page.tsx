import type { Metadata } from "next";
import { EnquiryForm } from "@/components/forms/enquiry-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Shipcove Trading team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <span className="label text-steel">Contact</span>
      <h1 className="mt-1 text-display-lg font-display font-bold tracking-tight text-hull">Get in touch</h1>
      <p className="mt-2 text-[14px] text-steel">
        Sourcing a specific part, or want to talk about a bulk order? Send us a message.
      </p>
      <div className="mt-8 rounded-sm border border-steel/15 bg-white p-6">
        <EnquiryForm type="rfq" />
      </div>
    </div>
  );
}
