const config = {
  darkMode: ["class"],
  content: [
    "./_includes/**/*.njk",
    "./pages/**/*.njk",
    "./public/**/*.js",
    "./lib/**/*.mjs",
    "./data/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Headings: Source Serif 4 (self-hosted in public/fonts).
        // Body + code: Source Sans Pro / Source Code Pro loaded via Google Fonts
        // <link> in layout.njk — clean stacks matching i3ai.org/htcc exactly.
        serif: ["var(--font-source-serif-pro)", "Georgia", "serif"],
        sans: ['"Source Sans Pro"', "sans-serif"],
        mono: ['"Source Code Pro"', "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f5f5f5",
          100: "#e5e5e5",
          200: "#d4d4d4",
          300: "#a3a3a3",
          400: "#737373",
          500: "#525252",
          600: "#404040",
          700: "#262626",
          800: "#171717",
          900: "#0a0a0a",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

module.exports = config;
