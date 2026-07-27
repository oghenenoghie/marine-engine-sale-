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
        hull: "#0E1621",
        steel: "#3B4A5A",
        paper: "#F4F2EC",
        blueprint: "#2E6E9E",
        signal: "#C6602B",
        patina: "#6E8B7B",
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
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(46,110,158,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(46,110,158,0.14) 1px, transparent 1px)",
      },
      backgroundSize: {
        blueprint: "32px 32px",
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
