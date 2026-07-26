import test from "node:test";
import assert from "node:assert/strict";

const controls = ["control_evidence_required", "audit_evidence_required", "privacy_evidence_required", "continuity_evidence_required"];

test("Release 290 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

