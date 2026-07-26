import test from "node:test";
import assert from "node:assert/strict";

const controls = ["service_evidence_required", "supplier_evidence_required", "privacy_evidence_required"];

test("Release 160 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

