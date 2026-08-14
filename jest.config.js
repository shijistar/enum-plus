/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/specs/jest/**/*.{spec,test}.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/test/specs/jest/jest.setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coveragePathIgnorePatterns: ['src/extension.d.ts'],
  moduleNameMapper: {
    '^@enum-plus/(.*)$': '<rootDir>/src/$1',
    '^@enum-plus': '<rootDir>/src',
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
