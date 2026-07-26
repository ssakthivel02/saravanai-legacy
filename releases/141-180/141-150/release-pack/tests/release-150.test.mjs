import test from "node:test";
import assert from "node:assert/strict";

const controls = ["security_evidence_required", "accessibility_evidence_required", "localisation_evidence_required"];

test("Release 150 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

