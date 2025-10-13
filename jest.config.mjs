/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  collectCoverageFrom: ["src/*.{js,ts}"],
  coveragePathIgnorePatterns: ["/node_modules/", "/test/"],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleFileExtensions: ["ts", "js"],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testRegex: "((\\.|/)(test|spec))\\.(js?|ts?)$",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
