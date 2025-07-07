const nodeVersion = process.versions.node.split('.').map(Number)[0];

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['<rootDir>/tses/test/**/*.{spec,test}.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/tses/src/**/*.js'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coveragePathIgnorePatterns: ['<rootDir>/es/types.js', '<rootDir>/es/localize-interface.js'],
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
if (nodeVersion <= 15) {
  // @ts-expect-error: because setupTestFrameworkScriptFile is a deprecated API
  config.setupTestFrameworkScriptFile = '<rootDir>/tses/test/jest.setup.js';
} else {
  config.setupFilesAfterEnv = ['<rootDir>/tses/test/jest.setup.js'];
}

export default config;
