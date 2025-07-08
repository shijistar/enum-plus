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
const enumDeclaration = readFileSync(`${pre5Dir}/enum.d.ts`, 'utf-8');
writeFileSync(`${pre5Dir}/enum.d.ts`, enumDeclaration.replace(/const\s+(\w+\s+extends)/g, '$1'));
