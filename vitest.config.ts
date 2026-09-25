import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  root: path.resolve('.'),
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 10 * 60 * 1000,
    hookTimeout: 15 * 60 * 1000,
    include: ['src/test/**/*.test.ts'],
    fileParallelism: false,
  },
});
