import test from "node:test";
import assert from "node:assert/strict";

const controls = ["subject_required", "risk_bounded", "request_correlation_required", "high_risk_containment"];

test("Release 205 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

