import { defineConfig } from 'father';

export default defineConfig({
  cjs: { input: 'src', output: 'lib', transformer: 'esbuild' },
  esm: { input: 'src', output: 'es', transformer: 'babel' },
  sourcemap: true,
  targets: { chrome: 80 },
});
