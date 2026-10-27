
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "localhost",
    port: 5173,

    proxy: {
      // Frontend calls /api/customers/register.
      // Backend receives /customers/register.
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },

      // Support API calls that do not use the /api prefix.
      "/customers": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },

      "/assets": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },

      "/creator": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },

      "/wishlist": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },

      "/cart": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },

      "/orders": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});
