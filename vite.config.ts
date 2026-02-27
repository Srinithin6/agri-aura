import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {

  // Load environment variables
  const env = loadEnv(mode, '.', '');

  return {

    // ✅ REQUIRED for GitHub Pages (repo name)
    base: '/agri-aura/',

    // ✅ React plugin
    plugins: [react()],

    // ✅ Development server settings
    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    // ✅ Build output folder (important for GitHub Actions)
    build: {
      outDir: 'dist',
      sourcemap: false,
    },

    // ✅ Environment variables
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    // ✅ Path alias
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }

  };

});
