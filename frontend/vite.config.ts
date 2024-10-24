import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()], // this is necessary to avoid "process is not defined issue"],
  build: { outDir: 'build', sourcemap: true },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
})
