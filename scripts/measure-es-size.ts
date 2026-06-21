import { spawnSync } from 'child_process';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';
import { minify } from 'terser';
import { constants, gzipSync } from 'zlib';

const outputDirectory = 'es';

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  buildEs();

  const files = findJavaScriptFiles(outputDirectory);
  if (files.length === 0) {
    throw new Error(`No JavaScript files found in ${outputDirectory}`);
  }

  const sizes = await Promise.all(
    files.map(async (file) => {
      const source = readFileSync(file, 'utf8');
      const result = await minify(source, {
        compress: {
          passes: 3,
        },
        format: {
          comments: false,
        },
        mangle: true,
        module: true,
      });
      if (result.code === undefined) {
        throw new Error(`Terser did not produce output for ${file}`);
      }
      console.log(file);
      console.log(result.code);

      return {
        file: relative(outputDirectory, file),
        size: gzipSync(result.code, {
          level: constants.Z_BEST_COMPRESSION,
        }).byteLength,
      };
    }),
  );

  const total = sizes.reduce((sum, item) => sum + item.size, 0);
  const fileColumnWidth = Math.max(...sizes.map((item) => item.file.length), 'File'.length);

  console.log('\nMinified + gzipped sizes:');
  console.log(`${'File'.padEnd(fileColumnWidth)}  Size`);
  for (const item of sizes) {
    console.log(`${item.file.padEnd(fileColumnWidth)}  ${formatSize(item.size)}`);
  }
  console.log(`${'Total'.padEnd(fileColumnWidth)}  ${formatSize(total)} (${total} bytes)`);
}

function buildEs() {
  console.log('Building ES modules...');
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npm, ['run', 'build'], {
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function findJavaScriptFiles(directory: string): string[] {
  return readdirSync(directory)
    .flatMap((name) => {
      const path = join(directory, name);
      return statSync(path).isDirectory() ? findJavaScriptFiles(path) : path.endsWith('.js') ? [path] : [];
    })
    .sort();
}

function formatSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(2)} KiB`;
}
