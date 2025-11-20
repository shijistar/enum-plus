module.exports = {
  extends: ['./node_modules/@tiny-codes/code-style-all-in-one/eslint/config/typescript'],
  parserOptions: {
    project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};
