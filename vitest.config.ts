import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    exclude: ["**/e2e/**", "**/node_modules/**", "**/dist/**"],
  },
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "src/infrastructure/ui/components"),
      "@/hooks": path.resolve(__dirname, "src/infrastructure/ui/hooks"),
      "@/views": path.resolve(__dirname, "src/infrastructure/ui/views"),
      "@/store": path.resolve(__dirname, "src/infrastructure/store"),
      "@/styles": path.resolve(__dirname, "src/infrastructure/ui/styles"),
      "@/routes": path.resolve(__dirname, "src/infrastructure/ui/routes"),
      "@": path.resolve(__dirname, "src"),
    },
  },
});
