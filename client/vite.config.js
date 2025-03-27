import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  // Development server configuration
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4001', // Local backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  // Production build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      external: ['@react-google-maps/api'],
    }
  },
  resolve: {
    alias: {
      '@react-google-maps/api': '@react-google-maps/api/dist/react-google-maps-api.umd.js'
    }
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled'],
  },
  // Environment variables configuration
  define: {
    'process.env': process.env
  }
});