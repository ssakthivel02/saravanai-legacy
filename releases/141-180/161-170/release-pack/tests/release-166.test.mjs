import test from "node:test";
import assert from "node:assert/strict";

const controls = ["contracts_required", "quality_rules_required", "tenant_boundary_required"];

test("Release 166 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

