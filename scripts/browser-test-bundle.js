const { rollup } = require('rollup');
const resolve = require('@rollup/plugin-node-resolve');

async function build() {
  // Bundle modern browsers
  const modern = await rollup({
    input: 'es/index.js',
    plugins: [resolve()],
  });

  await modern.write({
    file: 'test-browser/fixtures/es-modern-bundle.js',
    format: 'iife',
    name: 'EnumPlus',
  });

  // Bundle legacy browsers
  const legacy = await rollup({
    input: 'es-legacy/index.js',
    plugins: [resolve()],
  });

  await legacy.write({
    file: 'test-browser/fixtures/es-legacy-bundle.js',
    format: 'iife',
    name: 'EnumPlus',
  });
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
