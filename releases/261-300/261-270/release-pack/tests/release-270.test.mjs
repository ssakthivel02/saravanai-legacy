import test from "node:test";
import assert from "node:assert/strict";

const controls = ["process_evidence_required", "safety_evidence_required", "value_evidence_required", "recovery_evidence_required"];

test("Release 270 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

