/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/backstory': {
          target: env.VITE_BACKSTORY_PROXY_URL ?? 'http://localhost:8787',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/backstory/, ''),
        },
      },
    },
    test: {
      environment: 'node',
    },
  }
})
