module.exports = {
  verbose: true,
  automock: false,
  collectCoverage: true,
  coverageReporters: process.env.CI ? ['text'] : [],
  setupFiles: [],
  setupFilesAfterEnv: ['<rootDir>/testSetupFile.js'],
  globals: {
    __DEV__: true,
  },
};
