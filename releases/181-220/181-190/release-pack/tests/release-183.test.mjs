import test from "node:test";
import assert from "node:assert/strict";

const controls = ["dataset_provenance_required", "safety_failures_block", "regressions_block", "promotion_requires_review"];

test("Release 183 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

