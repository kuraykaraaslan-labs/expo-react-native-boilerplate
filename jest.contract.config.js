// Contract harness (docs/phases/19-tests/00-harness-and-scope.md): the app's own services and Zod
// schemas against a REAL next-boilerplate server — no msw. Opt-in: `npm run test:contract` with
// CONTRACT_API_URL set; never part of `npm test`.
const base = require("./jest.config");

/** @type {import('jest-expo').JestPreset} */
module.exports = {
  ...base,
  setupFiles: ["<rootDir>/__tests__/contract/env.ts"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/contract/setup.ts"],
  testRegex: "__tests__/contract/.*\\.contract\\.ts$",
  collectCoverageFrom: undefined,
  testTimeout: 60_000,
};
