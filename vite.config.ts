import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
      
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server:{
    host: '0.0.0.0',
    port: 5173,
    open: true,
  },
  define: {
    'process.env': {},
    'global': {},
  },
  resolve: {
    alias: {
      'stream': 'stream-browserify',
      'buffer': 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer']
  }
})