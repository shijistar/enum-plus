import { createJsWithBabelEsmPreset } from 'ts-jest';

const presetConfig = createJsWithBabelEsmPreset({
  tsconfig: './tsconfig.json',
});
/** @type {import('jest').Config} */
export default {
  ...presetConfig,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.{spec,test}.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  transform: {
    ...presetConfig.transform,
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(i18next-vue|vue|@vueuse))/'],
  moduleNameMapper: {
    '^@enum-plus/test/(.*)$': '<rootDir>/../../tses/test/$1',
    '^@enum-plus/(.*)$': '<rootDir>/../../es/$1',
    '^@enum-plus': '<rootDir>/../../es',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
