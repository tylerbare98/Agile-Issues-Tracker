import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Agile-Issues-Tracker/',
  server: {
    port: 5000
  }
})
