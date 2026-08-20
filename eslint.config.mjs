import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const typescript = require('@tiny-codes/code-style-all-in-one/eslint/typescript').default;

const projectFiles = ['./tsconfig.eslint.json', './packages/*/tsconfig.json'];

export default [
  {
    name: 'enum-plus/ignores',
    ignores: [
      '.DS_Store',
      'node_modules/**',
      'coverage/**',
      'lib/**',
      'es/**',
      'es-legacy/**',
      'umd/**',
      'tslib/**',
      'tses/**',
      'public/**',
      'e2e/fixtures/scripts',
      '.vscode/**',
      '*.md',
      '*.vue',
    ],
  },
  ...typescript.map((config) => {
    return {
      ...config,
      languageOptions: {
        ...config.languageOptions,
        parserOptions: {
          // @ts-expect-error
          ...config.languageOptions?.parserOptions,
          project: projectFiles,
        },
      },
    };
  }),
];
