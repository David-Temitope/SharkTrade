/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(222 47% 6%)",
        primary: {
          DEFAULT: "hsl(142 71% 45%)",
          foreground: "hsl(144 33% 98%)",
        },
        accent: {
          DEFAULT: "hsl(45 93% 58%)",
          foreground: "hsl(45 93% 5%)",
        },
        card: {
          DEFAULT: "hsl(222 47% 10%)",
          foreground: "hsl(210 40% 98%)",
        },
        muted: {
          DEFAULT: "hsl(217.2 32.6% 17.5%)",
          foreground: "hsl(215 20.2% 65.1%)",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
