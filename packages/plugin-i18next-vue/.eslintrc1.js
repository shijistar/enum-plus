export default {
  extends: ['../../node_modules/@tiny-codes/code-style-all-in-one/eslint/config/vue-typescript'],
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};
