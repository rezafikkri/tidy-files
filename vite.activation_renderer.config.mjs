import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        activation_window: resolve(__dirname, 'src/activation_window/index.html'),
      },
    },
  },
});
