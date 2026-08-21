import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        civic: {
          navy: "#0F172A",
          slate: "#1E293B",
          light: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
          blue: "#2563EB",
          "blue-dark": "#1E40AF",
          amber: "#D97706",
          green: "#059669",
          red: "#DC2626",
          accent: "#1D4ED8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        editorial: ["Georgia", "serif"],
      },
      fontSize: {
        "acc-xs": "calc(0.75rem * var(--text-scale, 1))",
        "acc-sm": "calc(0.875rem * var(--text-scale, 1))",
        "acc-base": "calc(1rem * var(--text-scale, 1))",
        "acc-lg": "calc(1.125rem * var(--text-scale, 1))",
        "acc-xl": "calc(1.25rem * var(--text-scale, 1))",
        "acc-2xl": "calc(1.5rem * var(--text-scale, 1))",
        "acc-3xl": "calc(1.875rem * var(--text-scale, 1))",
        "acc-4xl": "calc(2.25rem * var(--text-scale, 1))",
        "acc-5xl": "calc(3rem * var(--text-scale, 1))",
      },
    },
  },
  plugins: [],
};

export default config;
