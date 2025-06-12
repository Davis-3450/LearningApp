import { defineConfig } from 'vitest/config';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

const rootDir = __dirname;

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: rootDir,
  },
  plugins: [tsconfigPaths()],
});
