import { defineConfig } from 'father';

export default defineConfig({
  esm: { input: 'src', output: 'es', transformer: 'babel' },
  umd: { entry: 'src', output: 'umd' },
  sourcemap: true,
  targets: { chrome: 80 },
  plugins: ['./plugins/legacy-mode.ts'],
});
