/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Playfair Display'", "'Merriweather'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "'Inter'", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        vault: {
          paper: "#FAF8F5",
          dark: "#121417",
          card: "#FFFFFF",
          border: "#E4E1DB",
          accent: "hsl(243, 80%, 62%)",
          accentLight: "hsl(222, 100%, 95%)",
          muted: "#686561",
        },
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        craft: "0 4px 16px -2px rgba(28, 25, 23, 0.08)",
      },
    },
  },
  plugins: [],
};
