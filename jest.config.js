/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.{spec,test}.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coveragePathIgnorePatterns: ['src/types.ts', 'src/localize-interface.ts', 'src/extension.d.ts'],
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
