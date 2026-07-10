import type { Metadata } from "next";
import { archivo, plexSans, plexMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Drydock — Marine diesel engines & spare parts",
    template: "%s · Drydock",
  },
  description:
    "A B2B trading platform for marine diesel engines and spare parts, built around interactive, drawing-driven part discovery.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(archivo.variable, plexSans.variable, plexMono.variable)}>
      <body>{children}</body>
    </html>
  );
}
