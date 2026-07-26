import test from "node:test";
import assert from "node:assert/strict";

const controls = ["publisher_required", "permission_minimisation", "egress_allowlist_required"];

test("Release 174 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

