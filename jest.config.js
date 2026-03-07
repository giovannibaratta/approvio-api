const mainSettings = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", {}]
  },
  moduleNameMapper: {}
}

const testSettings = {
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov", "html"],
  collectCoverageFrom: [
    "**/*.ts",
    // Artifacts and other exclusions
    "!**/node_modules/**",
    "!**/*.mock.ts",
    "!build/**"
  ],
  modulePathIgnorePatterns: ["<rootDir>/build/"],
  setupFilesAfterEnv: ["<rootDir>/src/utils/matchers.ts"],
  transformIgnorePatterns: []
}

module.exports = {
  ...mainSettings,
  ...testSettings
}
