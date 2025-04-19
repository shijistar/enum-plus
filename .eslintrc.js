module.exports = {
  extends: ['./node_modules/@tiny-codes/code-style-all-in-one/eslint/config/typescript'],
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};
