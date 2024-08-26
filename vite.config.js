import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
    server: {
        host: true,
        port: 8000,
    },

    plugins: [react(), sentryVitePlugin({
        org: "cc-services-sas",
        project: "javascript-react",
        // sourcemaps: {
        //     // delete the sourcemaps after the build
        //     filesToDeleteAfterUpload: "./dist/**/*.map",
        // }
    })],

    build: {
        sourcemap: true
    }
});