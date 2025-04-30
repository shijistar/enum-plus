/*----------------------------------------------------------------------------*/
/* WARNING: THIS FILE MUST BE MAINTAINED AS JAVASCRIPT (NOT TYPESCRIPT),       */
/*          AND REMAIN COMPATIBLE WITH NODE.JS V13                            */
/*----------------------------------------------------------------------------*/
const { writeFileSync } = require('fs');
const pkg = require('../package.json');
const tsconfig = require('../tsconfig.json');
const libTsconfig = require('../tsconfig.lib.json');

const versionFile = process.argv[2];
// eslint-disable-next-line @typescript-eslint/no-var-requires
const legacyPkg = require(`../package-legacy-${versionFile}.json`);

if (!versionFile) {
  console.error('Please provide a version number as an argument.');
  process.exit(1);
}

// legacy package.json for node13 and previous
Object.assign(pkg, legacyPkg);
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n', { encoding: 'utf8' });

// legacy tsconfig.json
tsconfig.compilerOptions.module = 'commonjs';
tsconfig.compilerOptions.moduleResolution = 'node';
tsconfig.compilerOptions.jsx = 'preserve';
tsconfig.compilerOptions.declaration = false;
writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2) + '\n', { encoding: 'utf8' });

// legacy tsconfig.lib.json
libTsconfig.compilerOptions.module = 'commonjs';
libTsconfig.compilerOptions.moduleResolution = 'node';
writeFileSync('tsconfig.lib.json', JSON.stringify(libTsconfig, null, 2) + '\n', { encoding: 'utf8' });
