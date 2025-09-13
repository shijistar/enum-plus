import { cpSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

const libDir = './lib';

rmSync(libDir, {
  recursive: true,
  force: true,
});

cpSync('./tslib/packages/plugin-antd/src', libDir, {
  recursive: true,
  force: true,
  errorOnExist: false,
});

const files = readdirSync(libDir);

files.forEach((file) => {
  if (file.endsWith('.map')) {
    const filePath = join(libDir, file);
    const content = readFileSync(filePath, 'utf-8');
    const newContent = content.replace(/"sources":\s*\["\.\.\/\.\.\/src\//g, '"sources":["../src/');
    writeFileSync(filePath, newContent);
  }
});
