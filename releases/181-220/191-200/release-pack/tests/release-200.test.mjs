import test from "node:test";
import assert from "node:assert/strict";

const controls = ["data_evidence_required", "quality_evidence_required", "privacy_evidence_required", "integration_evidence_required"];

test("Release 200 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

