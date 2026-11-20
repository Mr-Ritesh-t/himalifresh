import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        himali: {
          primary: "#064B32", // Primary forest green
          green: "#0B6B43",   // Secondary vibrant green
          dark: "#073D2B",    // Dark forest green
          gold: "#E9BE54",    // Golden yellow / accent
          cream: "#F7F0E3",   // Himalayan warm cream (matches hero torn paper)
          white: "#FFFFFF",   // Pure white for floating cards
          text: "#202820",    // Main readable text
          muted: "#6C756D",   // Secondary text
          border: "#E8DFC8",  // Warm subtle border matching cream tone
          light: "#FAF5EB",   // Ultra-light cream tint
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(6, 75, 50, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        cardHover: "0 10px 25px -4px rgba(6, 75, 50, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
