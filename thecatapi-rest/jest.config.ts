import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/tests/**/*.spec.ts', '**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

export default config;
