import test from "node:test";
import assert from "node:assert/strict";

const controls = ["dataset_provenance_required", "evaluation_required", "reproducibility_required"];

test("Release 167 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

