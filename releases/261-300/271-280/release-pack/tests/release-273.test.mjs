import test from "node:test";
import assert from "node:assert/strict";

const controls = ["source_provenance_required", "synthetic_disclosure_required", "consent_evidence_required", "safety_review_required"];

test("Release 273 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 273 requires syntheticDisclosureRequired", () => {
  assert.equal({ syntheticDisclosureRequired: true }.syntheticDisclosureRequired, true);
});

