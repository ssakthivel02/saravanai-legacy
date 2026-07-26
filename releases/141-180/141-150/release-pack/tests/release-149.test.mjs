import test from "node:test";
import assert from "node:assert/strict";

const controls = ["role_alignment_required", "consent_for_tracking", "assessment_evidence_required"];

test("Release 149 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

