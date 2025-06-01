import { defineConfig } from 'father';

const legacy = process.env.LEGACY === '1';
export default defineConfig({
  esm: { input: 'src', output: legacy ? 'es-legacy' : 'es', transformer: 'babel' },
  umd: {
    entry: 'src',
    name: 'EnumPlus',
    output: {
      path: 'umd',
      filename: legacy ? 'enum-plus-legacy.min' : 'enum-plus.min',
    },
  },
  sourcemap: true,
  targets: legacy ? /* ES2015 */ { ie: 11 } : /* ES2020 */ { chrome: 80 },
});
