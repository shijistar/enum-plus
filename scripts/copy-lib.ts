// This script copies the contents of the `tslib/src` directory to the `lib` directory.
// 遍历lib目录下的所有的.map文件，把"sources":["../../src/*.ts"]替换为"sources":["../src/*.ts"]
import { copySync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs-extra';
import { join } from 'path';

const libDir = 'lib';

rmSync(libDir, {
  recursive: true,
  force: true,
});

copySync('tslib/src', libDir, {
  overwrite: true,
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
