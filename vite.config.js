import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from 'rollup-plugin-visualizer';

// import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
    server: {
        watch: {
            ignored: [
                "**/INSIGHTSAPI/**", // Django project directory
                "**/node_modules/**", // Node.js dependencies
                "**/dist/**", // Build output
                "**/.env*", // Environment files
                "**/logs/**", // Logs
                "**/tmp/**", // Temporary files
                "**/migrations/**", // Django migrations
                "**/venv/**", // Python virtual environment
                "**/__pycache__/**", // Python bytecode cache
            ],
        },
        host: true,
        port: 8000,
    },

    plugins: [
        react(),
        visualizer(),
        sentryVitePlugin({
            org: "cc-services-sas",
            project: "javascript-react",
            authToken: process.env.SENTRY_AUTH_TOKEN,
            sourcemaps: {
                // delete the sourcemaps after the build
                filesToDeleteAfterUpload: "./dist/**/*.map",
            },
        }),
    ],

    build: {
        sourcemap: true,
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes("node_modules")) {
                            // Example: create a chunk for all vendor libraries
                            return "vendor";
                        }
                        // Add more conditions if needed for specific chunks
                    },
                },
            },
        },
    },
});

