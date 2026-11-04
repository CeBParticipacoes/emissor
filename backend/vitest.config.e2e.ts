import { defineConfig } from 'vitest/config';
import { config as loadDotenv } from 'dotenv';

loadDotenv({ path: '../.env' });

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
});