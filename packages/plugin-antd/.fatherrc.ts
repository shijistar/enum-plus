import { defineConfig } from 'father';

export default defineConfig({
  esm: { input: 'src', output: 'es', transformer: 'babel' },
  sourcemap: true,
  targets: { chrome: 80 },
  plugins: ['../../scripts/legacy-mode.ts'],
});
