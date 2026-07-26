import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const policy = JSON.parse(await readFile(new URL("../policies/safety-defaults.json", import.meta.url), "utf8"));
test("all unsafe feature defaults remain disabled", () => {
  for (const [key, value] of Object.entries(policy)) {
    if (key === "schemaVersion") continue;
    assert.equal(value, false, `${key} must remain disabled`);
  }
});
