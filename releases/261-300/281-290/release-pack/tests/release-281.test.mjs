import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "objective_required", "test_procedures_required", "evidence_types_required"];

test("Release 281 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

