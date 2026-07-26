import test from "node:test";
import assert from "node:assert/strict";

const controls = ["success_owner_required", "goals_required", "risk_review_required"];

test("Release 154 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

