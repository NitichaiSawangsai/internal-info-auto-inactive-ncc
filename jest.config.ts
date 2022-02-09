import type { Config } from '@jest/types';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.(spec|e2e-spec)\\.ts$',
  coverageDirectory: 'test/coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**',
    '!<rootDir>/src/**/*.module.ts',
    '!<rootDir>/src/**/*.dto.ts',
    '!<rootDir>/src/**/*.config.ts',
    '!<rootDir>/src/**/*.constants.ts',
    '!<rootDir>/src/**/main.ts',
    '!<rootDir>/src/**/*.entity.ts',
    '!<rootDir>/src/**/*.exception.ts',
    '!<rootDir>/src/logging.interceptor.ts',
    '!<rootDir>/src/logger/winston-logger.service.ts',
    '!<rootDir>/src/health/health.controller.ts',
    '!<rootDir>/src/shared/prisma.service.ts',
    '!<rootDir>/test/config.test.ts',
  ],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testResultsProcessor: 'jest-sonar-reporter',
} as Config.InitialOptions;
