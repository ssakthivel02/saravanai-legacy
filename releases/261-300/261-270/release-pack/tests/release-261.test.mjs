import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "criticality_declared", "dependencies_mapped", "data_classification_required"];

test("Release 261 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

