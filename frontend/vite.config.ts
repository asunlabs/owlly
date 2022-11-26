import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteAliases } from 'vite-aliases';
import path from 'path';

export default defineConfig({
  plugins: [react(), ViteAliases()],

  // ! PATH: incorrect: "/src", correct: "./src"
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
  },
});
