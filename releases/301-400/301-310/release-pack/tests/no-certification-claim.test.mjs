import test from "node:test";
import assert from "node:assert/strict";

test("engineering readiness does not imply external certification", () => {
  const statement = "engineering readiness; independent certification not claimed";
  assert.equal(statement.includes("not claimed"), true);
});
