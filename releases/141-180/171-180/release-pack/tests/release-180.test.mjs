import test from "node:test";
import assert from "node:assert/strict";

const controls = ["evidence_hash_required", "multi_party_approval_required", "residual_risks_recorded"];

test("Release 180 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

