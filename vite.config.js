// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['79d0370928f7.ngrok-free.app'], //원래 localhost5173
    proxy: {
      '/api': {
        target: 'https://94c75f131f02.ngrok-free.app', //원래 localhost8080
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
