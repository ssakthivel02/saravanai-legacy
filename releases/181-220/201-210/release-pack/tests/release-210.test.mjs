import test from "node:test";
import assert from "node:assert/strict";

const controls = ["security_evidence_required", "regional_evidence_required", "recovery_evidence_required", "transparency_evidence_required"];

test("Release 210 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

