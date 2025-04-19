'use strict';

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['lib/src/**/*.js'],
  coveragePathIgnorePatterns: ['lib/src/types.js'],
  setupFiles: ['./lib/test/jest.setup.js'],
  moduleNameMapper: {
    '^@enum-plus': '<rootDir>/lib/src',
    '^@enum-plus/(.*)$': '<rootDir>/lib/src/$1',
  },
};
