const { spawnSync } = require("node:child_process");

const args = process.argv.slice(2);
const jestBin = require.resolve("jest/bin/jest");

const result = spawnSync(process.execPath, [jestBin, ...args], {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "test",
  },
});

process.exit(result.status ?? 1);
