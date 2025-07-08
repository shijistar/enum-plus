/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['<rootDir>/tses/test/**/*.{spec,test}.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/es/**/*.js'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coveragePathIgnorePatterns: ['<rootDir>/es/types.js', '<rootDir>/es/localize-interface.js'],
  setupFilesAfterEnv: ['<rootDir>/tses/test/jest.setup.js'],
  moduleNameMapper: {
    '^@enum-plus/(.*)$': '<rootDir>/es/$1',
    '^@enum-plus': '<rootDir>/es/index.js',
  },
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', { useESM: true }],
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

module.exports = config;
