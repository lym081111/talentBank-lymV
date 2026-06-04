/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  test: {
    // Run tests in Node (no browser needed for pure utility tests)
    environment: 'node',
    // Match test files in __tests__ directories or *.test.ts files
    include: ['src/**/__tests__/**/*.test.ts', 'src/**/*.test.ts'],
    // Show individual test names in verbose mode
    reporter: ['verbose'],
  },
});
