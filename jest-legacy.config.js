'use strict';

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tslib/test/**/*.{spec,test}.js'],
  setupFilesAfterEnv: ['<rootDir>/tslib/test/jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/lib/**/*.js'],
  coveragePathIgnorePatterns: ['<rootDir>/lib/types.js'],
  moduleNameMapper: {
    '^@enum-plus': '<rootDir>/lib',
    '^@enum-plus/(.*)$': '<rootDir>/lib/$1',
  },
};
