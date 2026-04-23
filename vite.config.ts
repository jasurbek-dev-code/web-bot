import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  envPrefix: "NEXT_PUBLIC_",
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    port: 3000,
    allowedHosts: [".ngrok-free.app", "https://usta.kamtar.uz/api/bot"],
  },
  preview: {
    host: true,
    port: 3000,
    allowedHosts: [".ngrok-free.app", "https://usta.kamtar.uz/api/bot"],
  },
});
