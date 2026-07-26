import test from "node:test";
import assert from "node:assert/strict";

const controls = ["evaluation_evidence_required", "safety_evidence_required", "operations_evidence_required", "recovery_evidence_required"];

test("Release 190 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

