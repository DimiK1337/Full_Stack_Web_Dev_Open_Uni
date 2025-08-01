import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Backend server URL
        changeOrigin: true // Needed for virtual hosted sites
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true, // No need to import 'describe', 'expect', and 'test'
    setupFiles: './testSetup.js',
  }
})
