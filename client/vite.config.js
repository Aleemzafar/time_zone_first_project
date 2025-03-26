import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://time-zone-first-project-api.vercel.app' 
          : 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      external: ['@react-google-maps/api'], // Add this line
    }
  },
  resolve: {
    alias: {
      // Add this if you're still having issues
      '@react-google-maps/api': '@react-google-maps/api/dist/react-google-maps-api.umd.js'
    }
  },
  define: {
    'process.env': process.env
  }
})