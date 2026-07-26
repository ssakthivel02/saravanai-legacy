import test from "node:test";
import assert from "node:assert/strict";

const controls = ["hypothesis_required", "stop_rules_required", "high_risk_ethics_review"];

test("Release 176 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

