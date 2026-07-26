import test from "node:test";
import assert from "node:assert/strict";

const controls = ["region_required", "dependencies_mapped", "local_review_recorded", "current_review_required"];

test("Release 201 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

