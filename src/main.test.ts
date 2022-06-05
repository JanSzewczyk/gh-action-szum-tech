// eslint-disable-next-line filenames/match-regex
import { wait } from "./wait";
import { expect, test } from "@jest/globals";

test("throws invalid number", async () => {
  const input = parseInt("foo", 10);
  await expect(wait(input)).rejects.toThrow("milliseconds not a number");
});

test("wait 500 ms", async () => {
  const start = new Date();
  await wait(500);
  const end = new Date();
  const delta = Math.abs(end.getTime() - start.getTime());
  expect(delta).toBeGreaterThan(450);
});

// shows how the runner will run a javascript action with env / stdout protocol
// test("test runs", () => {
//   process.env["INPUT_MILLISECONDS"] = "500";
//   const np = process.execPath;
//   const ip = path.join(__dirname, "..", "lib", "main.js");
//   const options: cp.ExecFileSyncOptions = {
//     env: process.env
//   };
//   // eslint-disable-next-line no-console
//   console.log(cp.execFileSync(np, [ip], options).toString());
// });
