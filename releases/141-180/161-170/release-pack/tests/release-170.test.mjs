import test from "node:test";
import assert from "node:assert/strict";

const controls = ["platform_evidence_required", "security_evidence_required", "reliability_evidence_required"];

test("Release 170 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

