import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access from different devices
    port: 5173, // Ensures Vite runs on a fixed port
    strictPort: true, // Prevents Vite from switching ports
    watch: {
      usePolling: true, // Helps detect file changes
    },
    hmr: {
      overlay: false, // Disables the HMR overlay error popup
    },
  },
});
