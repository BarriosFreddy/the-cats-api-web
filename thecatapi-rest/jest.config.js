"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
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
exports.default = config;
