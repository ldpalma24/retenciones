import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/retenciones/',
  plugins: [react()],
  build: {
    outDir: 'docs'
  }
})