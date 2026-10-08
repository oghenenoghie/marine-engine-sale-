import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";

// Space Grotesk tops out at weight 700 (no 800) — `font-extrabold` (800)
// usage sitewide synthetic-bolds from 700, which reads fine on a geometric
// sans; this is an accepted tradeoff, not an oversight.
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});
