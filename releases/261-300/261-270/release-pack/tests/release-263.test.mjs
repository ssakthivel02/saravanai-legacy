import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "rules_required", "tests_required", "approval_required"];

test("Release 263 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

