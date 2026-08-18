/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['<rootDir>/tses/test/specs/jest/**/*.{spec,test}.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/es-legacy/**/*.js'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coveragePathIgnorePatterns: [
    '<rootDir>/es-legacy/types.js',
    '<rootDir>/es-legacy/localize-interface.js',
    '<rootDir>/es-legacy/extension.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/tses/test/specs/jest/jest.setup.js'],
  moduleNameMapper: {
    '^@enum-plus/(.*)$': '<rootDir>/es-legacy/$1',
    '^@enum-plus': '<rootDir>/es-legacy/index.js',
  },
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', { useESM: true }],
  },
};

module.exports = config;
