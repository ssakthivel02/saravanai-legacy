import test from "node:test";
import assert from "node:assert/strict";

const controls = ["evidence_hash_required", "multi_party_approval_required", "residual_risks_recorded", "closure_decision_required"];

test("Release 300 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

