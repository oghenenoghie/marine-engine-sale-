import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Near-black — primary dark surface (header, footer, hero, drawing backdrops).
        hull: "#0A0B0D",
        // Secondary dark surface — one step up from hull, for panels/cards on a dark ground.
        graphite: "#1D1F22",
        // Neutral mid-grey — borders, muted text, dividers. Deliberately hue-free.
        steel: "#4B4E54",
        // Light neutral grey — secondary/placeholder text on both light and dark surfaces.
        ash: "#8A8D92",
        // Near-white page background.
        paper: "#FAFAF9",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.05", fontWeight: "800" }],
        "display-lg": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1", fontWeight: "700" }],
      },
      keyframes: {
        "draw-line": {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
        "infinite-scroll": {
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "infinite-scroll": "infinite-scroll var(--scroll-duration, 36s) var(--scroll-direction, forwards) linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
