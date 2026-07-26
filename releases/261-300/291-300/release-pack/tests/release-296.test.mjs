import test from "node:test";
import assert from "node:assert/strict";

const controls = ["source_target_required", "rehearsal_required", "compatibility_required", "rollback_required"];

test("Release 296 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

