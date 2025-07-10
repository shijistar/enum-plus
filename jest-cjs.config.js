const nodeVersion = process.versions.node.split('.').map(Number)[0];

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tslib/test/**/*.{spec,test}.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/lib/**/*.js'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coveragePathIgnorePatterns: [
    '<rootDir>/lib/types.js',
    '<rootDir>/lib/localize-interface.js',
    '<rootDir>/lib/extension.js',
  ],
  moduleNameMapper: {
    '^@enum-plus/(.*)$': '<rootDir>/lib/$1',
    '^@enum-plus': '<rootDir>/lib/index.js',
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
if (nodeVersion <= 15) {
  // @ts-expect-error: because setupTestFrameworkScriptFile is a deprecated API
  config.setupTestFrameworkScriptFile = '<rootDir>/tslib/test/jest.setup.js';
} else {
  config.setupFilesAfterEnv = ['<rootDir>/tslib/test/jest.setup.js'];
}

module.exports = config;
