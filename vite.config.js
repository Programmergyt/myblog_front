import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// vite用于开发和构建
// 只在开发环境有效，部署nginx运行时无效
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://8.153.79.69:8080',//把所有以 /api 开头的请求转发到 Spring Boot 8080 后端
        changeOrigin: true
      }
    }
  }
})
