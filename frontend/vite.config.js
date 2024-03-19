import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {defineConfig as defineVitestConfig} from 'vitest/config';


export default defineConfig({
  plugins: [react()],
  test: {
    
    globals: true,
    environment: 'jsdom',
  },
})
