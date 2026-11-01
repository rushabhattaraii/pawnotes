import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { notesApi } from "./server/notesApi";

const localApi: Plugin = {
  name: "pawnotes-local-api",
  configureServer(server) {
    server.middlewares.use(notesApi);
  },
};

export default defineConfig({
  plugins: [react(), localApi],
  server: { port: 5173, strictPort: true },
});
