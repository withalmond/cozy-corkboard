import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative paths so Electron can load dist/index.html from the filesystem
  base: process.env.NODE_ENV === "development" ? "/" : "./",
});
