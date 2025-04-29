import { nodeResolve } from '@rollup/plugin-node-resolve';
import { cpSync, readFileSync, writeFileSync } from 'fs';
import { rollup } from 'rollup';

async function build() {
  // Bundle modern browsers
  const modern = await rollup({
    input: 'es/index.js',
    plugins: [nodeResolve()],
  });
  await modern.write({
    file: 'e2e/fixtures/scripts/es-modern-bundle.js',
    format: 'iife',
    name: 'EnumPlus',
  });

  // Bundle legacy browsers
  const legacy = await rollup({
    input: 'es-legacy/index.js',
    plugins: [nodeResolve()],
  });
  await legacy.write({
    file: 'e2e/fixtures/scripts/es-legacy-bundle.js',
    format: 'iife',
    name: 'EnumPlus',
  });

  // Bundle serialize-javascript
  const serializePath = './e2e/fixtures/scripts/serialize-javascript.js';
  changeFormat('./tslib/test/utils/serialize-javascript.js', serializePath, 'SerializeJavascript');
  const serializeJavascript = await rollup({
    input: serializePath,
    plugins: [nodeResolve()],
  });
  await serializeJavascript.write({
    file: 'e2e/fixtures/scripts/serialize-javascript-bundle.js',
    format: 'iife',
  });

  // Bundle week-config
  const weekConfigPath = './e2e/fixtures/scripts/week-config.js';
  changeFormat('./tslib/test/data/week-config.js', weekConfigPath, 'WeekConfig', (content) => {
    return content.replace('require("@enum-plus")', 'window.EnumPlus');
  });
  const weekConfig = await rollup({
    input: weekConfigPath,
    plugins: [nodeResolve()],
  });
  await weekConfig.write({
    file: 'e2e/fixtures/scripts/week-config-bundle.js',
    format: 'iife',
  });

  // Bundle week-data
  const weekDataPath = './e2e/fixtures/scripts/week-data.js';
  changeFormat('./tslib/test/data/week-data.js', weekDataPath, 'WeekData');
  const weekDataConfig = await rollup({
    input: weekDataPath,
    plugins: [nodeResolve()],
  });
  await weekDataConfig.write({
    file: 'e2e/fixtures/scripts/week-data-bundle.js',
    format: 'iife',
  });
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});

function changeFormat(src: string, dest: string, name: string, replacer?: (content: string) => string) {
  cpSync(src, dest, {
    force: true,
  });
  let content = readFileSync(dest, 'utf-8');
  content = `var exports = {};\n` + content;
  if (name) {
    content += `\n window.${name} = exports;`;
  }
  if (replacer) {
    content = replacer(content);
  }
  writeFileSync(dest, content);
}
