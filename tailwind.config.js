/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // D&D Beyond inspired palette
        ink: "#1e2126",        // page background
        panel: "#26292f",      // card / panel background
        panel2: "#2f3238",     // slightly lighter panel
        line: "#3a3d44",       // hairline borders
        crimson: "#c53131",    // primary accent (DDB red)
        crimsonDark: "#8f1f1f",
        crimsonBright: "#e6393f",
        parchment: "#f4ede1",  // off-white text on dark
        muted: "#9a9ea6",
        gold: "#c9a15a",
      },
      fontFamily: {
        display: ["'Oswald'", "'Roboto Condensed'", "sans-serif"],
        body: ["'Roboto'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 0 0 rgba(0,0,0,0.4), 0 8px 20px -8px rgba(0,0,0,0.6)",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        slideUp: "slideUp 220ms ease-out",
        fadeIn: "fadeIn 220ms ease-out",
      },
    },
  },
  plugins: [],
};
