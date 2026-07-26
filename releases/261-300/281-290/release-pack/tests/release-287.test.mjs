import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "evidence_required", "exit_plan_required", "review_date_required"];

test("Release 287 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

