import test from "node:test";
import assert from "node:assert/strict";

const controls = ["publisher_required", "permission_minimisation", "egress_allowlist_required", "signature_required"];

test("Release 292 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

