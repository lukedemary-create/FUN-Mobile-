import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  logLevel: 'info',
  server: {
    port: 5174,
    strictPort: false,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'micromark-util-sanitize-uri': path.resolve(__dirname, 'node_modules/micromark-util-sanitize-uri/index.js'),
    },
  },
});