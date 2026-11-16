import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The frontend talks to the backend via /api. Vite forwards these requests
// to the backend on port 4000 - so no CORS configuration is needed.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': process.env.API_TARGET || 'http://localhost:4000',
    },
  },
});
