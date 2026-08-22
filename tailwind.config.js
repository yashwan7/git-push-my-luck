/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0D12",
        inkRaised: "#14171F",
        inkLine: "#262B36",
        gold: "#E8B34D",
        goldSoft: "#8A6A2C",
        teal: "#4DD6B0",
        alert: "#E85D4D",
        paper: "#F4F1EA",
      },
      fontFamily: {
        ui: ["Atkinson Hyperlegible", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      keyframes: {
        irisOpen: {
          "0%": { strokeDashoffset: "251" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        irisOpen: "irisOpen linear forwards",
      },
    },
  },
  plugins: [],
};
