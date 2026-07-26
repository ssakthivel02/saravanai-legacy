import test from "node:test";
import assert from "node:assert/strict";

const controls = ["risk_tier_required", "owner_required", "limitations_recorded", "evaluation_evidence_required"];

test("Release 286 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

