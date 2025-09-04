import { nodeResolve } from '@rollup/plugin-node-resolve';
import { rollup } from 'rollup';

async function build() {
  // Bundle es folder for modern browsers
  const modern = await rollup({
    input: 'es/index.js',
    plugins: [nodeResolve()],
  });
  await modern.write({
    file: 'e2e/fixtures/scripts/es-modern-bundle.js',
    format: 'iife',
    name: 'EnumPlus',
  });

  // Bundle es-legacy folder for legacy browsers
  const legacy = await rollup({
    input: 'es-legacy/index.js',
    plugins: [nodeResolve()],
  });
  await legacy.write({
    file: 'e2e/fixtures/scripts/es-legacy-bundle.js',
    format: 'iife',
    name: 'EnumPlus',
  });

  // Bundle jsoneo library
  const jsoneoLib = await rollup({
    input: 'jsoneo/es/index.js',
    plugins: [nodeResolve()],
  });
  await jsoneoLib.write({
    file: 'e2e/fixtures/scripts/jsoneo-bundle.js',
    format: 'iife',
    name: 'jsoneo',
  });

  // Bundle week-config
  const weekConfig = await rollup({
    input: 'tses/test/data/week-config.js',
    plugins: [nodeResolve()],
  });
  await weekConfig.write({
    file: 'e2e/fixtures/scripts/week-config-bundle.js',
    format: 'iife',
    name: 'WeekConfig',
  });

  // Bundle week-data
  const weekDataConfig = await rollup({
    input: 'tses/test/data/week-data.js',
    plugins: [nodeResolve()],
  });
  await weekDataConfig.write({
    file: 'e2e/fixtures/scripts/week-data-bundle.js',
    format: 'iife',
    name: 'WeekData',
  });
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
