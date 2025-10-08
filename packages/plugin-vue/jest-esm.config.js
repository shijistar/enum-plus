/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['<rootDir>/tses/test/**/*.{spec,test}.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/es/**/*.js'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  setupFilesAfterEnv: ['<rootDir>/tses/test/jest.setup.js'],
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
