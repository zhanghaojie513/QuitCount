import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    warmup: {
      clientFiles: ["./src/main.jsx", "./src/refined-main.jsx", "./src/variants-main.jsx"],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        refined: "refined.html",
        balanced: "balanced.html",
        rich: "rich.html",
        impact: "impact.html",
      },
    },
  },
  plugins: [react()],
});
