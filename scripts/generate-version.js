const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');

generate(path.join(root, 'src/version.ts'));
generate(path.join(root, 'test/utils/version.ts'));

/** @param {string} outFile */
function generate(outFile) {
  try {
    const pkgPath = path.join(root, 'package.json');
    const pkgRaw = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgRaw);
    const version = pkg.version;
    if (!version || typeof version !== 'string') {
      throw new Error('Missing version field in package.json');
    }

    const content = `export const version = '${version}';\n`;

    if (fs.existsSync(outFile)) {
      const existing = fs.readFileSync(outFile, 'utf8');
      if (existing !== content) {
        fs.writeFileSync(outFile, content, 'utf8');
      }
    } else {
      fs.writeFileSync(outFile, content, 'utf8');
    }
  } catch (err) {
    console.error('Error generating version.ts:', err);
    process.exitCode = 1;
  }
}
