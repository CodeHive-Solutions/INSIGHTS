import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
    server: {
        host: true,
        port: 8000,
    },
    plugins: [react()],
});
