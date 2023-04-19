import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    server: {
        host: true,
        port: 8000, // This is the port which we will use in docker
    },
    plugins: [react()],
});
