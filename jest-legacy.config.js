/**
 * Jest config for the `es-legacy` ESM build.
 *
 * It relies on Jest 28+ features (`extensionsToTreatAsEsm`, `setupFilesAfterEnv`,
 * array-form `transform`), so it must run on the modern dependency tree.
 * The legacy Node.js 7~13 CI jobs install Jest 23 from package-legacy-node.json and
 * have to use jest-cjs.config.js instead; fail fast with a readable message if they
 * are ever pointed at this file again.
 */
let jestMajor = 0;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  jestMajor = Number(String(require('jest/package.json').version).split('.')[0]);
} catch (e) {
  // keep going: the version is only used for the sanity check below
}
if (jestMajor && jestMajor < 28) {
  throw new Error(
    'jest-legacy.config.js requires Jest >= 28 (detected Jest ' +
      jestMajor +
      '). Legacy Node.js 7~13 CI jobs must run `npm run test:jest-cjs` instead.'
  );
}

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
