'use strict';

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['tslib/src/**/*.js'],
  coveragePathIgnorePatterns: ['tslib/src/types.js'],
  setupFiles: ['./tslib/test/jest.setup.js'],
  moduleNameMapper: {
    '^@enum-plus': '<rootDir>/tslib/src',
    '^@enum-plus/(.*)$': '<rootDir>/tslib/src/$1',
  },
};
