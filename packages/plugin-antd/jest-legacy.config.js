'use strict';

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tslib/test/**/*.{spec,test}.js'],
  setupFiles: ['./tslib/test/jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: ['tslib/src/**/*.js'],
  coveragePathIgnorePatterns: ['tslib/src/types.js'],
};
