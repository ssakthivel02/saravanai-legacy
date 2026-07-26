import test from "node:test";
import assert from "node:assert/strict";

const controls = ["severity_required", "evidence_preservation_required", "owner_required", "critical_escalation_required"];

test("Release 187 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

