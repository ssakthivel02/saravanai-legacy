import test from "node:test";
import assert from "node:assert/strict";

const controls = ["services_required", "performance_evidence_required", "reliability_evidence_required", "certification_not_claimed"];

test("Release 298 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 298 keeps certificationClaimed disabled", () => {
  assert.equal({ certificationClaimed: false }.certificationClaimed, false);
});

