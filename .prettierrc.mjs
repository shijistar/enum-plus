import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const prettier = require('@tiny-codes/code-style-all-in-one/prettier').default;

export default prettier;
