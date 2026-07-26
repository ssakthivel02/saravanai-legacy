import test from "node:test";
import assert from "node:assert/strict";

const controls = ["energy_estimate_recorded", "accessibility_evidence_required", "mitigations_required"];

test("Release 179 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

