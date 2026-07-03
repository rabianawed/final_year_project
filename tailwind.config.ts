export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { primary: "#2563EB", secondary: "#0F172A", accent: "#22C55E", danger: "#EF4444", warning: "#F59E0B" },
      fontFamily: { sans: ["Inter", "sans-serif"] }
    }
  },
  plugins: []
};
