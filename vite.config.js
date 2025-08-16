// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // 모든 프록시 경로에 적용할 공통 헤더
  const ngrokSkipHeader = { 'ngrok-skip-browser-warning': 'true' };

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: ['.ngrok-free.app'],
      // ngrok로 열 때 HMR 설정 (기존 로직 유지)
      hmr: env.VITE_TUNNEL_HOST
        ? { host: env.VITE_TUNNEL_HOST, protocol: 'wss', clientPort: 443 }
        : undefined,

      // ★ 핵심: 모든 프록시 요청에 ngrok 우회 헤더 추가
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          headers: ngrokSkipHeader, // 헤더 추가
        },
        '/uploads': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          headers: ngrokSkipHeader, // 헤더 추가
        },
        '/files': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          headers: ngrokSkipHeader, // 헤더 추가
        },
        '/static': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          headers: ngrokSkipHeader, // 헤더 추가
        },
        '/images': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          headers: ngrokSkipHeader, // 헤더 추가
        },
      },
    },
  }
})
