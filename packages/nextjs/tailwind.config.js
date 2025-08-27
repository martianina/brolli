/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}"
  ],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#111111",            // very dark gray
          "primary-content": "#FFFFFF",
          secondary: "#333333",          // dark gray
          "secondary-content": "#FFFFFF",
          accent: "#555555",             // medium gray
          "accent-content": "#FFFFFF",
          neutral: "#777777",            // neutral gray
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",         // lightest background
          "base-200": "#F5F5F5",         // very light gray background
          "base-300": "#E5E5E5",         // light gray surface
          "base-content": "#111111",     // dark text
          info: "#888888",               // muted info gray
          success: "#666666",            // dark gray for success
          warning: "#555555",            // dark gray warning
          error: "#444444",              // dark gray error

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
          primary: "#FFFFFF",            // white for dark theme primary (buttons, highlights)
          "primary-content": "#111111",
          secondary: "#DDDDDD",          // light gray
          "secondary-content": "#111111",
          accent: "#AAAAAA",             // medium gray accent
          "accent-content": "#111111",
          neutral: "#888888",            // neutral gray
          "neutral-content": "#FFFFFF",
          "base-100": "#111111",         // dark base background
          "base-200": "#1A1A1A",         // slightly lighter dark gray
          "base-300": "#2A2A2A",         // dark gray surface
          "base-content": "#FFFFFF",     // text white
          info: "#AAAAAA",
          success: "#888888",
          warning: "#777777",
          error: "#666666",

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
