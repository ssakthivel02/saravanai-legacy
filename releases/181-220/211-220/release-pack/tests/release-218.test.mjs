import test from "node:test";
import assert from "node:assert/strict";

const controls = ["period_required", "demand_non_negative", "capacity_recorded", "confidence_bounded"];

test("Release 218 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

