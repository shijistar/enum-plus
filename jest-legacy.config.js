'use strict';

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tslib/test/**/*.{spec,test}.js'],
  setupFiles: ['<rootDir>/tslib/test/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/tslib/test/jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/lib/**/*.js'],
  coveragePathIgnorePatterns: ['<rootDir>/lib/types.js'],
  moduleNameMapper: {
    '^@enum-plus/(.*)$': '<rootDir>/lib/$1',
    '^@enum-plus': '<rootDir>/lib',
  },
};
