import { defineConfig } from 'father';

const legacy = process.env.LEGACY === '1';
export default defineConfig({
  esm: { input: 'src', output: legacy ? 'es-legacy' : 'es', transformer: 'babel' },
  sourcemap: true,
  targets: legacy ? /* ES2015 */ { ie: 11 } : /* ES2020 */ { chrome: 80 },
});
