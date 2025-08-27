/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#A7EFFF", // very light aqua
          "primary-content": "#003B46", // deep teal text
          secondary: "#7ED0E6", // soft aqua blue
          "secondary-content": "#025259", // darker teal
          accent: "#009FB7", // bright teal accent
          "accent-content": "#E0FFFF", // light aqua text
          neutral: "#007C91", // muted teal neutral
          "neutral-content": "#F0FEFF",
          "base-100": "#F0FEFF", // very pale aqua
          "base-200": "#D8F7FB",
          "base-300": "#A7EFFF",
          "base-content": "#025259",
          info: "#007C91",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",
          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#025259", // strong dark teal
          "primary-content": "#A7EFFF", // light aqua text
          secondary: "#007C91", // teal midtone
          "secondary-content": "#E0FFFF", // light aqua
          accent: "#A7EFFF", // aqua accent
          "accent-content": "#025259",
          neutral: "#E0FFFF",
          "neutral-content": "#009FB7",
          "base-100": "#003B46", // deepest base
          "base-200": "#025259",
          "base-300": "#007C91",
          "base-content": "#E0FFFF",
          info: "#A7EFFF",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",
          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        "space-grotesk": ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
