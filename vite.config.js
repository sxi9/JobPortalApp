import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: mode === 'production' ? '/JobPortalApp/' : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true
    },
    server: {
      port: 5173,
    },
  };
});
