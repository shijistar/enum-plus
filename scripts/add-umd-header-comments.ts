import { readFileSync, writeFileSync } from 'fs';
import packageJson from '../package.json';

const headerComment = `/**
 * ${packageJson.name}
 *
 * @author: ${packageJson.author}
 * @version: ${packageJson.version}
 */`;

const filePath = './umd/enum-plus.min.js';
const umdJsContent = readFileSync(filePath, 'utf8');
writeFileSync(filePath, `${headerComment}\n${umdJsContent}`);
