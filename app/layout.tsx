import type { Metadata } from "next";
import { archivo, plexSans, plexMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { getFaviconUrl } from "@/lib/data/settings";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const faviconUrl = await getFaviconUrl();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: "Shipcove Trading — Marine diesel engines & spare parts",
      template: "%s · Shipcove Trading",
    },
    description:
      "A B2B trading platform for marine diesel engines and spare parts, built around interactive, drawing-driven part discovery.",
    icons: faviconUrl ? { icon: faviconUrl, shortcut: faviconUrl, apple: faviconUrl } : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(archivo.variable, plexSans.variable, plexMono.variable)}>
      <body>{children}</body>
    </html>
  );
}
