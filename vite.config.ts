import react from "@vitejs/plugin-react";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default {
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "public/images/*",
          dest: "aws/assets/images",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "aws/assets/[name]-[hash].js",
        chunkFileNames: "aws/assets/[name]-[hash].js",
        assetFileNames: "aws/assets/[name]-[hash].[ext]",
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom", "zustand", "zod"],
          mui: ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
          muix: ["@mui/x-data-grid", "@mui/x-date-pickers"],
        },
      },
    },
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
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
};
