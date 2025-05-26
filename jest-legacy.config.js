'use strict';

const nodeVersion = process.versions.node.split('.').map(Number)[0];

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tslib/test/**/*.{spec,test}.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/lib/**/*.js'],
  coveragePathIgnorePatterns: ['<rootDir>/lib/types.js'],
  moduleNameMapper: {
    '^@enum-plus/(.*)$': '<rootDir>/lib/$1',
    '^@enum-plus': '<rootDir>/lib',
  },
};
if (nodeVersion <= 15) {
  // @ts-expect-error: because setupTestFrameworkScriptFile is a deprecated API
  config.setupTestFrameworkScriptFile = '<rootDir>/tslib/test/jest.setup.js';
} else {
  config.setupFilesAfterEnv = ['<rootDir>/tslib/test/jest.setup.js'];
}

module.exports = config;
