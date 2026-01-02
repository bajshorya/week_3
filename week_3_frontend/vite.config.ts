import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // React dev server port
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Your Axum backend
        changeOrigin: true,
      },
    },
  },
});
