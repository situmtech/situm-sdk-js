/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  collectCoverageFrom: ["src/*.{js,ts}"],
  coveragePathIgnorePatterns: ["/node_modules/", "/test/"],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 78, // TODO: increase coverage back to 80
      lines: 78, // TODO: increase coverage back to 80
      statements: 78, // TODO: increase coverage back to 80
    },
  },
  moduleFileExtensions: ["ts", "js"],
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "((\\.|/)(test|spec))\\.(js?|ts?)$",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
