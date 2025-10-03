import { existsSync, readFileSync, writeFileSync } from 'fs';
import packageJson from '../package.json';

const headerComment = (legacy: boolean) => `/**
 * ${packageJson.name} (${legacy ? 'ES2015' : 'ES2020'} compatible})
 * ${packageJson.description}
 *
 * @version: ${packageJson.version}
 * @author: ${packageJson.author}
 * @link ${packageJson.homepage}
 */`;

if (process.env.LEGACY === '1') {
  const legacyFilePath = './umd/enum-plus-legacy.min.js';
  if (existsSync(legacyFilePath)) {
    const legacyJsContent = readFileSync(legacyFilePath, 'utf8');
    writeFileSync(legacyFilePath, `${headerComment(true)}\n${legacyJsContent}`);
  }
} else {
  const filePath = './umd/enum-plus.min.js';
  if (existsSync(filePath)) {
    const umdJsContent = readFileSync(filePath, 'utf8');
    writeFileSync(filePath, `${headerComment(false)}\n${umdJsContent}`);
  }
}
