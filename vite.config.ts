import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "tailwindcss";
import { VitePWA } from 'vite-plugin-pwa'
 
export default defineConfig({
  plugins: [
    react(),
    VitePWA()
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

