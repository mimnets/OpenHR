import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Make environment variables available in the app via import.meta.env
        'import.meta.env.REACT_APP_POCKETBASE_URL': JSON.stringify(env.REACT_APP_POCKETBASE_URL),
        'import.meta.env.REACT_APP_GEMINI_API_KEY': JSON.stringify(env.REACT_APP_GEMINI_API_KEY),
        // Legacy support for process.env if needed
        'process.env.REACT_APP_POCKETBASE_URL': JSON.stringify(env.REACT_APP_POCKETBASE_URL),
        'process.env.REACT_APP_GEMINI_API_KEY': JSON.stringify(env.REACT_APP_GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
            },
          },
        },
      },
    };
});