import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "hypothesis_required", "budget_bounded", "ethical_review_for_high_risk"];

test("Release 215 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

