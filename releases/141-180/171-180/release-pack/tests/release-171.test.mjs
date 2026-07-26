import test from "node:test";
import assert from "node:assert/strict";

const controls = ["standards_required", "compatibility_tests_required", "fallback_required"];

test("Release 171 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

