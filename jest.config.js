// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!your-package-to-transform|another-package).+\\.js$",
  ],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
