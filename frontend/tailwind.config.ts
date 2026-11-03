import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F9FA",
        surface: "#FFFFFF",
        surfaceElevated: "#F3F4F6",
        border: "#E5E7EB",
        borderLight: "#F1F2F4",
        primary: {
          DEFAULT: "#0F5132", // Deep pine/emerald green
          dark: "#0B3D26",
          light: "#198754",
          soft: "#E8F5E9",
          mint: "#D1E7DD",
        },
        slateText: {
          primary: "#111827",
          secondary: "#4B5563",
          muted: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        cardHover: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        subtle: "0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
