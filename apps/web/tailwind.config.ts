import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        blue: {
          50: "#f0f7fb",
          100: "#dbebf6",
          200: "#bad8ed",
          300: "#8ac0e1",
          400: "#54a2d1",
          500: "#3187bd",
          600: "#056ba6",
          700: "#045585",
          800: "#044771",
          900: "#083b5e",
          950: "#052640",
        }
      }
    }
  },
  plugins: []
} satisfies Config;