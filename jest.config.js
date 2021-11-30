/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "src(.*)((\\.|/)(test|spec))\\.(js?|ts?)$",
  moduleFileExtensions: ["ts", "js"],
};
