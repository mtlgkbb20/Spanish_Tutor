import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // "@/components" → src/components
      "@/components": path.resolve(__dirname, "src/components"),
      "@/components/ui": path.resolve(__dirname, "src/components/ui")
    }
  }
});
