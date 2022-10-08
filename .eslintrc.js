module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:eslint-comments/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    project: ['./tsconfig.json', './tsconfig.test.json'],
  },
  rules: {
    'array-callback-return': ['error'],
    'no-constructor-return': ['error'],
    'no-promise-executor-return': ['error'],
    'no-template-curly-in-string': ['error'],
    'require-atomic-updates': ['error'],
    'no-self-compare': ['error'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-await-in-loop': ['warn'],
    'no-unmodified-loop-condition': ['warn'],
    eqeqeq: ['error', 'always', { null: 'ignore' }],

    // 禁用以下规则，采用eslint-plugin-prettier中的默认规则
    // indent: ['error', 2, { SwitchCase: 1 }],
    // semi: ['off'],
    // 'no-unused-vars': ['off'],
    // 'prefer-const': ['off'],
    // 'prefer-destructuring': ['off'],
    // 'no-plusplus': ['off'],
    // 'no-lonely-if': ['off'],
    // 'no-else-return': ['off'],

    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'none' }],
    '@typescript-eslint/no-inferrable-types': ['off'],
    '@typescript-eslint/consistent-type-imports': ['error'],
    '@typescript-eslint/ban-tslint-comment': ['error'],
    '@typescript-eslint/class-literal-property-style': ['error'],
    '@typescript-eslint/consistent-type-assertions': ['error'],
    '@typescript-eslint/no-duplicate-imports': ['error'],
    '@typescript-eslint/consistent-type-exports': [
      'error',
      {
        fixMixedExportsWithInlineTypeSpecifier: false,
      },
    ],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        'ts-check': false,
        minimumDescriptionLength: 4,
      },
    ],
  },
};
