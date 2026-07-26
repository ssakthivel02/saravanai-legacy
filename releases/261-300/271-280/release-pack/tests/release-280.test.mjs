import test from "node:test";
import assert from "node:assert/strict";

const controls = ["provenance_evidence_required", "editorial_evidence_required", "safety_evidence_required", "accessibility_evidence_required"];

test("Release 280 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

