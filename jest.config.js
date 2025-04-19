/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root
 * directory of this source tree.
 */

'use strict';

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: ['src/types.ts'],
  setupFiles: ['./test/jest.setup.ts'],
  moduleNameMapper: {
    '^@enum-plus': '<rootDir>/src',
    '^@enum-plus/(.*)$': '<rootDir>/src/$1',
  },
};
