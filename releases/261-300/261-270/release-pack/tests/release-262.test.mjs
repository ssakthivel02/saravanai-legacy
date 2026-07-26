import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "steps_required", "retries_bounded", "rollback_required"];

test("Release 262 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

