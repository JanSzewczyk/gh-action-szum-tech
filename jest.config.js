/** @type {import('@jest/types').Config.InitialOptions} */

module.exports = {
  clearMocks: true,
  moduleFileExtensions: ["js", "ts"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  verbose: true,
  moduleNameMapper: {
    "@services/(.*)": "<rootDir>/src/services/$1",
    "@tests/(.*)": "<rootDir>/src/tests/$1",
    "@types": "<rootDir>/src/types.ts",
    "@utils/(.*)": "<rootDir>/src/utils/$1"
  }
};
