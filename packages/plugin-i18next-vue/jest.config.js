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
  transformIgnorePatterns: ['node_modules/(?!(i18next-vue|vue|@vueuse))/', '/test/jest.setup.ts$'],
  moduleNameMapper: {
    '^@enum-plus/test/(.*)$': '<rootDir>/../../tslib/test/$1',
    '^@enum-plus/(.*)$': '<rootDir>/../../lib/$1',
    '^@enum-plus': '<rootDir>/../../lib',
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
