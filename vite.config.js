import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'import.meta.env.VERCEL_ENV': JSON.stringify(process.env.VERCEL_ENV || '')
  },
  server: { host: '0.0.0.0', allowedHosts: true }
})
