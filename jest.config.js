/**
 * Jest Configuration for POL RSS Gallery
 *
 * Configured for SPFx 1.21 with React 17 and TypeScript.
 */

module.exports = {
  // Use ts-jest for TypeScript support
  preset: 'ts-jest',

  // Use jsdom for DOM testing
  testEnvironment: 'jsdom',

  // Root directories for tests
  roots: ['<rootDir>/tests', '<rootDir>/src'],

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],

  // Module path aliases (match tsconfig paths)
  moduleNameMapper: {
    // Mock CSS/SCSS modules
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // Mock static assets
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/tests/mocks/fileMock.js',

    // SPFx module mocks
    '^@microsoft/sp-core-library$': '<rootDir>/tests/mocks/spfxMocks.ts',
    '^@microsoft/sp-http$': '<rootDir>/tests/mocks/spfxMocks.ts',
    '^@microsoft/sp-webpart-base$': '<rootDir>/tests/mocks/spfxMocks.ts',
    '^@microsoft/sp-property-pane$': '<rootDir>/tests/mocks/spfxMocks.ts',
    '^@microsoft/sp-component-base$': '<rootDir>/tests/mocks/spfxMocks.ts',

    // DOMPurify mock for security tests
    '^dompurify$': '<rootDir>/tests/mocks/dompurifyMock.ts',

    // Localization strings mock
    '^RssFeedWebPartStrings$': '<rootDir>/tests/mocks/localizationMock.ts',
  },

  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup/setupTests.ts'],

  // Transform TypeScript files
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
        // Disable type checking for faster tests (types checked at build time)
        isolatedModules: true,
      },
    ],
  },

  // Files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/loc/**',
    '!src/**/*.module.scss.ts',
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Coverage reporters
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],

  // Coverage output directory
  coverageDirectory: '<rootDir>/coverage',

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/dist/'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Maximum test workers (use all available)
  maxWorkers: '50%',

  // Fail tests on console warnings/errors (optional, uncomment to enable)
  // errorOnDeprecated: true,

  // Global setup/teardown (optional)
  // globalSetup: '<rootDir>/tests/setup/globalSetup.ts',
  // globalTeardown: '<rootDir>/tests/setup/globalTeardown.ts',

  // Reporter configuration for CI
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test-results',
        outputName: 'junit.xml',
      },
    ],
  ],

  // Snapshot serializers (optional)
  snapshotSerializers: [],

  // Test timeout (default is 5000ms)
  testTimeout: 10000,

  // Watch plugins for interactive mode
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
