import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const directory = process.argv[2];
/*
 * This script adds .js extensions to `import` paths in output javascript files.
 *
 * Have tried the babel-plugin-add-import-extension plugin, but encountered "Maximum call stack size exceeded" error.
 * So changed to a post-build processing approach instead.
 */

if (directory) {
  processEnumTs(directory);
}

function processEnumTs(dir: string) {
  const enumPath = join(dir, 'enum.d.ts');
  let content = readFileSync(enumPath, 'utf8');
  content = content.replace(/\/\/\/ <reference types=["']([^"']+)["'] \/>/g, '').trimStart();
  content = `import './extension';\n` + content;
  writeFileSync(enumPath, content);
}
