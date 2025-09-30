import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { basename, join } from 'path';

const dtsFiles = glob.sync('./lib/**/*.d.ts');
const pre5Dir = './types-legacy/pre-v5';
const targetDirs = [pre5Dir];

// copy to target directories
targetDirs.forEach((targetDir) => {
  dtsFiles.forEach((file) => {
    const fileName = basename(file);
    const targetPath = join(targetDir, fileName);
    copyFileSync(file, targetPath);
  });
});

// Process for TypeScript version <5.0
fixFile(`${pre5Dir}/index.d.ts`, (content) => content.replace(/^/g, "import './extension';"));
fixFile(`${pre5Dir}/enum.d.ts`, (content) => content.replace(/const\s+(\w+\s+extends)/g, '$1'));
fixFile(`${pre5Dir}/enum-items.d.ts`, (content) => {
  return content.replace(/const\s+(\w+\s+extends)/g, '$1').replace(/const FV/g, 'FV');
});

function fixFile(file: string, replace: (content: string) => string) {
  const content = readFileSync(file, 'utf-8');
  writeFileSync(file, replace(content));
}
