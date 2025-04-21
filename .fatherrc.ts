import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    input: 'src',
    output: 'es',
    transformer: 'babel',
    // extraBabelPlugins: [['babel-plugin-add-import-extension', { extension: '.js' }]],
  },
  umd: { entry: 'src', output: 'umd' },
  sourcemap: true,
  targets: { chrome: 80 },
  plugins: ['./scripts/legacy-mode.ts'],
});
