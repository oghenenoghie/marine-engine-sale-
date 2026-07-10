import type { Enquiry } from "@/types";

export const enquiriesSeed: Enquiry[] = [
  {
    id: "e1",
    type: "rfq",
    stockItemId: "1",
    name: "Joris Verhoeven",
    company: "Verhoeven Marine Services",
    email: "joris@verhoevenmarine.nl",
    message: "Do you have two of these cylinder heads in stock? Need them for a VASA 32 overhaul in Rotterdam.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "e2",
    type: "sell",
    name: "Anders Lindqvist",
    company: "Baltic Ship Repair AB",
    email: "anders@balticshiprepair.se",
    message: "Brand: MAN\nModel: L21/31\nCondition: Used\n\nDecommissioning two auxiliary engines, hours ~38,000. Photos available on request.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
];
