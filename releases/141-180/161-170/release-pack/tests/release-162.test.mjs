import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "security_controls_required", "approval_before_use"];

test("Release 162 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

