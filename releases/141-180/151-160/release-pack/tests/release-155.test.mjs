import test from "node:test";
import assert from "node:assert/strict";

const controls = ["severity_required", "owner_required", "response_target_required"];

test("Release 155 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

