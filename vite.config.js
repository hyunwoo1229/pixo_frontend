// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: ['.ngrok-free.app'],
      hmr: env.VITE_TUNNEL_HOST
        ? { host: env.VITE_TUNNEL_HOST, protocol: 'wss', clientPort: 443 }
        : undefined,
      proxy: {
        '/api': {
          // 백엔드 ngrok 쓰면 여기만 바꾸면 됨
          target: env.VITE_BACKEND_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
