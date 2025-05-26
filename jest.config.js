/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.{spec,test}.{ts,tsx}'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coveragePathIgnorePatterns: ['src/types.ts', 'src/extension.d.ts'],
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
