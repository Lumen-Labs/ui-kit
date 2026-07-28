import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const showcaseRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: showcaseRoot,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: fileURLToPath(new URL("../showcase-dist", import.meta.url)),
    emptyOutDir: true,
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
  },
});
