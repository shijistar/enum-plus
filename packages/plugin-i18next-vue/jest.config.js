import { createJsWithTsEsmPreset } from 'ts-jest';

/** @type {import('jest').Config} */
export default {
  ...createJsWithTsEsmPreset({
    tsconfig: './tsconfig.json',
  }),
  // preset: 'ts-jest/presets/js-with-ts-esm',
  // preset: 'ts-jest/presets/default-esm',
  // preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.{spec,test}.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
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
