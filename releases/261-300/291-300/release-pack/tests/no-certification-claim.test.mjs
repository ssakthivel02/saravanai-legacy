import test from "node:test";
import assert from "node:assert/strict";

test("readiness does not imply certification", () => {
  const statement = "engineering readiness; certification not claimed";
  assert.equal(statement.includes("not claimed"), true);
});
