// jest.config.mjs
export default {
    // Add any custom configuration options here
    testEnvironment: 'node', // Use the Node.js environment for testing
    verbose: true, // Display detailed information about the tests
    testMatch: ['**/__tests__/**/*.test.mjs'], // Specify the test file pattern
    preset: 'ts-jest', // Use the ts-jest preprocessor
    globals: {'ts-jest': {useESM: true,},}, // Use the ESM version of ts-jest
  };