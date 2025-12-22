import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

export default createJestConfig(
  /** @type {import('jest').Config} */ {
    // preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/test/**/*.{spec,test}.{ts,tsx}'],
    setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
    moduleNameMapper: {
      '^@enum-plus/test/(.*)$': '<rootDir>/../../tslib/test/$1',
      '^@enum-plus/(.*)$': '<rootDir>/../../lib/$1',
      '^@enum-plus': '<rootDir>/../../lib',
    },
    coverageProvider: 'v8',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    coveragePathIgnorePatterns: ['src/serverLocalize.ts'],
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  }
);
