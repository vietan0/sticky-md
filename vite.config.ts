import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import 'dotenv/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    proxy: {
      '/api': process.env.VITE_SCRAPER_URL,
    },
  },
  css: {
    devSourcemap: true,
  },
});
