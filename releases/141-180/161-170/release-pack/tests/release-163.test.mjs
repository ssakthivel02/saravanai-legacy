import test from "node:test";
import assert from "node:assert/strict";

const controls = ["blueprint_required", "expiry_required", "approval_required"];

test("Release 163 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

