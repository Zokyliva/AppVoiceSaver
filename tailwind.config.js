/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Palette inspirée d'un carnet de notes + onde sonore
        paper: "#F6F2E9",
        ink: "#22271F",
        muted: "#6E6B5F",
        line: "#DCD6C6",
        record: "#D9573B",   // accent chaud pour l'enregistrement
        tag: "#3E6E5E",      // vert profond pour tags/validation
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
