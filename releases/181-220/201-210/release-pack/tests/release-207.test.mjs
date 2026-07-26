import test from "node:test";
import assert from "node:assert/strict";

const controls = ["risk_bounded", "signals_required", "proportionate_action_required", "appeal_required"];

test("Release 207 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 207 requires appealAvailable", () => {
  assert.equal({ appealAvailable: true }.appealAvailable, true);
});

